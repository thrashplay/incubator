import { ActionType } from 'typesafe-actions'

import {
  CharacterEvents,
  CommonEvents,
  FrameEvents,
  RulesEvents,
  SceneEvents,
} from '@thrashplay/gemstone-model'

export const NOOP = { type: 'noop' } as const

export const AllEvents = {
  ...CharacterEvents,
  ...CommonEvents,
  ...RulesEvents,
  ...SceneEvents,
  ...FrameEvents,
  NOOP,
}

/** action that can be dispatched, and represents state changes that have already happened */
export type Event = ActionType<typeof AllEvents>
