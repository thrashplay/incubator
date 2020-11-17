import { Dictionary } from '@thrashplay/gemstone-model'
import { Origin, Point } from '@thrashplay/math'

import { Entity } from '../entity'

/** Interface for entities that have a position in the world. */
export type Positionable = {
  position: Point
}

/** Extends an entity with Positionable state. */
export const extend = <
  TFacets extends Dictionary<string, any> = Dictionary<string, any>
>(entity: Entity<TFacets>): Entity<TFacets & Positionable> => ({
  ...entity,
  position: Origin,
})
