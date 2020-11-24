import { ActionType } from 'typesafe-actions'

import { createEntityTransformation } from '@thrashplay/gemstone-engine'

import { TICK_DURATION } from '../constants'

import { Entity } from './../entity'
import { World } from './facet'

export const advanceTime = (tickDuration: number) => (entity: Entity, numberOfTicks: number): Entity<World> => {
  return ({
    ...entity,
    time: (entity.time ?? 0) + (numberOfTicks * tickDuration),
  })
}
export const WorldTransformations = {
  /** Transformation that updates an entity's time data by advancing it by a specified number of ticks. */
  advanceTime: createEntityTransformation('advance-time', advanceTime(TICK_DURATION)),
}
export type WorldTransformations = ActionType<typeof WorldTransformations>
