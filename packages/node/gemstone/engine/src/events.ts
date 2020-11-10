import { ActionType } from 'typesafe-actions'

import { MapEvents } from '@thrashplay/gemstone-map-model'
import {
  CharacterEvents,
  CommonEvents,
  FrameEvents,
  RandomTablesEvents,
  RulesEvents,
  SceneEvents,
} from '@thrashplay/gemstone-model'

export const NOOP = { type: 'noop' } as const

export const AllEvents = {
  ...CharacterEvents,
  ...CommonEvents,
  ...MapEvents,
  ...RandomTablesEvents,
  ...RulesEvents,
  ...SceneEvents,
  ...FrameEvents,
  NOOP,
}

/** action that can be dispatched, and represents state changes that have already happened */
export type Event = ActionType<typeof AllEvents>
