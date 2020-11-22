import { isArray, omit, without } from 'lodash/fp'

import { add } from '@thrashplay/fp'
import { Entity, MightBe } from '@thrashplay/gemstone-engine'

import { Containable } from './containable'
import { Container } from './container'

/**
 * Sets the container ID for an entity. This function does not verify the container exists.
 */
export const setContainerId = (containerId: Entity['id']) => (entity: Entity): Entity<Containable> => ({
  ...entity,
  containerId,
})

/** Clears the container ID for an entity. */
export const clearContainerId = () => (entity: Entity) => ({
  ...omit('containerId', entity) as Entity,
})

/** Adds an entity to a container's content list. */
export const addToContents = (entityId: Entity['id']) => (container: Entity): Entity<Container> => ({
  ...container,
  contents: isArray(container.contents) ? add(container.contents, entityId) : [entityId],
})

/** Removes an entity from a container's content list. */
export const removeFromContents = (entityId: Entity['id']) => (container: MightBe<Container>) => ({
  ...container,
  contents: isArray(container.contents) ? without([entityId], container.contents) : [entityId],
})
