import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '../common'

import { RulesEvent } from './events'
import { RulesState } from './state'

export const reduceRulesState = (state: RulesState, event: RulesEvent | CommonEvent): RulesState => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return {
        meleeRange: 10,
        movement: {
          defaultMode: 'hustle',
          modes: {
            cautious: {
              id: 'cautious',
              name: 'Cautious',
              multiplier: 0.1,
            },
            hustle: {
              id: 'hustle',
              name: 'Hustle',
              multiplier: 1,
            },
            run: {
              id: 'run',
              name: 'Run',
              multiplier: 2,
            },
          },
        },
        segmentDuration: 5,
      }

    default:
      return state
  }
}
