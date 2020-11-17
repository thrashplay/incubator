import { Point } from '@thrashplay/math'

import { Entity } from '../entity'

import { Positionable } from './positionable'

/** Sets the position of an entity, making it Positionable. */
export const setPosition = (position: Point) => (entity: Entity): Entity<Positionable> => ({
  ...entity,
  position,
})
