import { ActionType } from 'typesafe-actions'

import { TICK_DURATION } from '../constants'
import { createEntityTransformation, createWorldTransformation } from '../transformation'
import { WorldState } from '../world-state'

import { Entity } from './../entity'
import { World } from './facet'

const advanceTime = (tickDuration: number) => (entity: Entity<World>, numberOfTicks: number): Entity<World> => {
  return ({
    ...entity,
    time: (entity.time ?? 0) + (numberOfTicks * tickDuration),
  })
}

const spawnEntity = (world: WorldState, entity: Entity) => {
  return world
}

export const WorldTransformations = {
  /** Transformation that updates an entity's time data by advancing it by a specified number of ticks. */
  advanceTime: createEntityTransformation('advance-time', advanceTime(TICK_DURATION)),

  /** Adds an entity to the world. Will fail if the entity has an ID that already exists. */
  spawnEntity: createWorldTransformation('spawn-entity', spawnEntity),
}
export type WorldTransformations = ActionType<typeof WorldTransformations>
