import { getType } from 'typesafe-actions'

import { CommonAction, CommonActions } from '../common'

import { RulesAction } from './actions'
import { RulesState } from './state'

export const reduceRulesState = (state: RulesState, action: RulesAction | CommonAction): RulesState => {
  switch (action.type) {
    case getType(CommonActions.initialized):
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
