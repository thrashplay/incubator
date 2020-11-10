import * as _ from 'lodash'
import { createSelector } from 'reselect'

import { Dice } from '@thrashplay/gemstone-dice'

import { createParameterSelector } from '../common'

import { RandomTable, RandomTablesStateContainer } from './state'

export interface RandomTablesSelectorParameters {
  tableId?: RandomTable['id']
  rollResult?: number
}

const getTableIdParam = createParameterSelector((params?: RandomTablesSelectorParameters) => params?.tableId)
const getRollResultParam = createParameterSelector((params?: RandomTablesSelectorParameters) => params?.rollResult)

export const getRandomTableState = (state: RandomTablesStateContainer) => state.tables ?? {}

/** Selects a table with the specified ID. */
export const getRandomTable = createSelector(
  [getRandomTableState, getTableIdParam],
  (tables, id) => id === undefined ? undefined : tables[id]
)

/** Selects the dice expression used to roll on a table. */
export const getDiceExpression = createSelector(
  [getRandomTable],
  (table) => table?.diceExpression ?? 'd0'
)

/**
 * Selects the result of rolling a value against a table.
 * Will return the matching result, if it exists, or the default if it doesn't.
 * May return undefined if the table doesn't even exist.
 */
export const getRandomTableResult = createSelector(
  [getRandomTable, getRollResultParam],
  (table, result) => _.get(table, `results[${result}]`, table?.defaultResult)
)

/**
 * Returns a table roller function, which is a function that returns a random result from an
 * underlying table each time it is called.
 *
 * The returned function uses a static version of the state, and will not be updated if the global
 * state is changed. A new roller should be created in this case.
 *
 * TODO: the typings are a mess here
 */
export const getTableRoller = <TResult extends unknown = any>(
  state: RandomTablesStateContainer,
  { tableId }: RandomTablesSelectorParameters
) => (): TResult => {
  return getRandomTableResult(state, {
    rollResult: Dice.roll(getDiceExpression(state, { tableId })),
    tableId,
  }) as TResult
}

export const getSingleResult = <TResult extends unknown = any>(
  state: RandomTablesStateContainer,
  { tableId }: RandomTablesSelectorParameters
) => {
  const rollResult = Dice.roll(getDiceExpression(state, { tableId }))
  return getRandomTableResult(state, { rollResult, tableId }) as TResult
}
