import { extend, Facet } from '@thrashplay/gemstone-engine'

import { tickHandler } from './actions/tick'

export interface World {
  time: number
}

/** Facet providing basic support for responding to the passage of time. */
export const WorldFacet: Facet<World> = {
  id: 'world',
  defaultActionHandlers: [tickHandler],
  defaultState: {
    time: 0,
  },
} as const

/** Extends an entity with the World facet. To make sense, there can be only one. */
export const makeWorld = extend(WorldFacet)
