
import { range } from 'lodash'
import { reduce } from 'lodash/fp'

import { createBuilder } from '@thrashplay/fp'

import { getNextTableId } from './get-next-table-id'
import { RandomTable } from './state'

export interface InitialRandomTableValues<TResult extends unknown = any> {
  defaultResult: TResult
  diceExpression: string
  name?: string
}

export const buildRandomTable = createBuilder((initialValues: InitialRandomTableValues): RandomTable => {
  const { defaultResult, diceExpression, name } = initialValues

  const id = getNextTableId()

  return {
    id,
    defaultResult,
    diceExpression,
    name: name ?? id,
    results: {},
  }
})

const createRangeReducer = <TResult extends unknown = any>(result: TResult) =>
  (table: RandomTable<TResult>, rollValue: number) => {
    return addResult(rollValue, result)(table)
  }

const addResults = <TResult extends unknown = any>(minRoll: number, maxRoll: number, result: TResult) =>
  (table: RandomTable<TResult>) =>
    reduce(createRangeReducer(result))(table)(range(minRoll, maxRoll + 1))

const addResult = <TResult extends unknown = any>(rollValue: number, result: TResult) =>
  (table: RandomTable<TResult>) => ({
    ...table,
    results: {
      ...table.results,
      [rollValue]: result,
    },
  })

export const RandomTableBuilder = {
  addResult,
  addResults,
}
