import { has } from 'lodash/fp'
import { Maybe } from 'monet'

import {
  AnyFacets,
  createEntitySelector,
  Entity,
  getEntity,
  MightBe,
  resolveEntity,
  UnresolvedEntity,
  WorldState,
} from '@thrashplay/gemstone-engine'

import { Containable } from '../containable'
import { Container } from '../container'

/**
 * Selects a container's entity, if one exists, or returns Nothing if the entity has no container
 * or an invalid container.
 **/
export const getContainer = createEntitySelector((
  state,
  entity: MightBe<Containable>
): Maybe<MightBe<Container>> => {
  return getEntity(state)(entity.containerId)
})

/** Determines if an entity ID is associated with a Containable or not. */
export const isContainableId = <TFacets extends AnyFacets = AnyFacets>(state: WorldState) =>
  (entityOrId: UnresolvedEntity<TFacets>): boolean => {
    return resolveEntity(entityOrId, state)
      .map(isContainable)
      .orJust(false)
  }

/** Determines if an entity is Containable or not. */
export const isContainable = (entity: MightBe<Containable>): entity is Entity<Containable> => has('containerId')(entity)
