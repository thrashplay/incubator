import { createAction } from '../api/action'
import { Entity } from '../entity'

export type ContainerDetails = {
  containerId: Entity['id']
}

export const ContainableActions = {
  /** The source entity is attempting to put the target into the specified container. */
  store: createAction('store')<ContainerDetails>(),

  /** The source entity is attempting to remove the target from the specified container. */
  remove: createAction('remove')<ContainerDetails>(),
}
