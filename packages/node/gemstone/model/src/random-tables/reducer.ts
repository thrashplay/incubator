import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '../common'

import { buildRandomTable, RandomTableBuilder } from './builders'
import { RandomTablesEvent } from './events'
import { RandomTableSet } from './state'

const roomsTable = buildRandomTable(
  {
    defaultResult: { width: 30, height: 30 },
    diceExpression: '1d20',
    name: 'Rooms',
  },
  RandomTableBuilder.addResult(1, { width: 10, height: 10 }),
  RandomTableBuilder.addResults(2, 4, { width: 20, height: 20 }),
  RandomTableBuilder.addResults(5, 7, { width: 30, height: 30 }),
  RandomTableBuilder.addResults(8, 10, { width: 40, height: 40 }),
  RandomTableBuilder.addResult(11, { width: 10, height: 20 }),
  RandomTableBuilder.addResults(12, 13, { width: 20, height: 30 }),
  RandomTableBuilder.addResults(14, 15, { width: 20, height: 40 }),
  RandomTableBuilder.addResults(16, 17, { width: 30, height: 40 }),
  // this is 'special' in the actual book
  RandomTableBuilder.addResults(18, 20, { width: 50, height: 50 })
)

export const reduceRandomTablesState = (
  state: RandomTableSet,
  event: RandomTablesEvent | CommonEvent
): RandomTableSet => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return {
        1: roomsTable,
      }

    default:
      return state
  }
}
