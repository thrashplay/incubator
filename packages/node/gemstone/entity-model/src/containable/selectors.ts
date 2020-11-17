import { Maybe } from '@thrashplay/fp/maybe'

import { createEntitySelector } from '../api/create-entity-selector'
import { getEntity, MightBe } from '../entity'

import { Containable } from './containable'

/**
 * Selects a container's entity, if one exists, or returns Nothing if the entity has no container
 * or an invalid container.
 **/
export const getContainer = createEntitySelector(
  (game, entity: MightBe<Containable>): Maybe<MightBe<Containable>> => {
    return getEntity(game)(entity.containerId)
  })
