import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '../common'

import { buildMovementMode, buildRules, RuleSetBuilder } from './builders'
import { RulesEvent } from './events'
import { RuleSet } from './state'

const { addMovementMode, setDefaultMovementMode } = RuleSetBuilder

const DEFAULT_RULES = buildRules(
  addMovementMode(buildMovementMode({ name: 'Cautious', multiplier: 0.1 })),
  addMovementMode(buildMovementMode({ name: 'Hustle' })),
  addMovementMode(buildMovementMode({ name: 'Run', multiplier: 2 })),
  setDefaultMovementMode('hustle')
)

export const reduceRulesState = (state: RuleSet, event: RulesEvent | CommonEvent): RuleSet => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return DEFAULT_RULES

    default:
      return state
  }
}
