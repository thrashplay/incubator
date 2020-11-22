import { curry } from 'lodash/fp'

import { Entity } from '../entity'

import { Facet } from './facet'

/** Extends an entity by adding the specified facet to it. */
export const extend = curry((facet: Facet, entity: Entity) => {
  return {
    ...entity,
    facets: [facet.id, ...entity.facets],
  }
})
