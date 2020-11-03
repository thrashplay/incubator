import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '../common'

import { addMovementMode, buildRules, newMovementMode, setDefaultMovementMode } from './builders'
import { RulesEvent } from './events'
import { RulesState } from './state'

const DEFAULT_RULES = buildRules(
  addMovementMode(newMovementMode('Cautious', 0.1)),
  addMovementMode(newMovementMode('Hustle')),
  addMovementMode(newMovementMode('Run', 2)),
  setDefaultMovementMode('hustle')
)

export const reduceRulesState = (state: RulesState, event: RulesEvent | CommonEvent): RulesState => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return DEFAULT_RULES

    default:
      return state
  }
}
