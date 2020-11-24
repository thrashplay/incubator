import { curry } from 'lodash/fp'

import { Entity } from '../entity'

import { Facet } from './facet'

/** Extends an entity by adding the specified facet to it. */
export const extend = curry((facet: Facet<any>, entity: Entity) => {
  return {
    ...entity,
    ...(facet.defaultState ?? {}),
    facets: [facet.id, ...entity.facets],
  }
})
