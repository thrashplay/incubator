import { ActionType } from 'typesafe-actions'

import {
  CharacterActions,
  CommonActions,
  FrameActions,
  RulesActions,
  SceneActions,
} from '@thrashplay/gemstone-model'

export const NOOP = { type: 'noop' } as const

export const AllActions = {
  ...CharacterActions,
  ...CommonActions,
  ...RulesActions,
  ...SceneActions,
  ...FrameActions,
  NOOP,
}

/** action that can be dispatched, and represents state changes that have already happened */
export type Action = ActionType<typeof AllActions>
