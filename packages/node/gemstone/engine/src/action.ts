import { ActionType } from 'typesafe-actions'

import {
  CharacterActions,
  CommonActions,
  RulesActions,
  SceneActions,
  SimulationActions,
} from '@thrashplay/gemstone-model'

export const NOOP = { type: 'noop' } as const

export const AllActions = {
  ...CharacterActions,
  ...CommonActions,
  ...RulesActions,
  ...SceneActions,
  ...SimulationActions,
  NOOP,
}

/** action that can be dispatched, and represents state changes that have already happened */
export type Action = ActionType<typeof AllActions>
