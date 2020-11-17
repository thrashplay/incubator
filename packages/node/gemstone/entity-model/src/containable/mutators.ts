import { omit } from 'lodash/fp'

import { Entity } from '../entity'

import { Containable } from './containable'

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
