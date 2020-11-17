import { Dictionary } from '@thrashplay/gemstone-model'
import { Origin, Point } from '@thrashplay/math'

import { Entity } from '../entity'

import * as effects from './effects'
import * as selectors from './selectors'

/** Interface for entities that have a position in the world. */
export type Positionable = {
  position: Point
}

/** Extends an entity with Positionable state. */
const extend = <
  TFacets extends Dictionary<string, any> = Dictionary<string, any>
>(entity: Entity<TFacets>): Entity<TFacets & Positionable> => ({
  ...entity,
  position: Origin,
})

export const Positionable = {
  ...effects,
  ...selectors,
  extend,
}
