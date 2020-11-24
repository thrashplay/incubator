import { ActionType } from 'typesafe-actions'

import { createEntityTransformation } from '@thrashplay/gemstone-engine'

import { advanceTime } from './advance-time'

/** Length of a game tick, in seconds. */
export const TICK_DURATION = 5

export const WorldTransformations = {
  /** Transformation that updates an entity's time data by advancing it by a specified number of ticks. */
  advanceTime: createEntityTransformation('advance-time', advanceTime(TICK_DURATION)),
}

export type WorldTransformations = ActionType<typeof WorldTransformations>
