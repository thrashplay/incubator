import { getType } from 'typesafe-actions'

import { addItem } from '@thrashplay/fp'

import { CommonEvent, CommonEvents } from '../common'

import { RandomTablesEvent, RandomTablesEvents } from './events'
import { RandomTableSet } from './state'

export const reduceRandomTablesState = (
  state: RandomTableSet,
  event: RandomTablesEvent | CommonEvent
): RandomTableSet => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return { }

    case getType(RandomTablesEvents.tableCreated):
      return addItem(state, event.payload)

    default:
      return state
  }
}
