import { flow } from 'lodash'
import { Maybe } from 'monet'

import {
  Entity,
  resolveEntity,
  UnresolvedEntity,
  WorldState,
  WorldStateBuilders,
} from '@thrashplay/gemstone-engine'

import { Containable } from './containable'
import { Container } from './container'
import { addToContents, setContainerId } from './mutators'
import { isContainable } from './selectors/containable'
import { isContainer } from './selectors/container'

const { updateEntity } = WorldStateBuilders

const createPlaceInsiderMutator = (item: Entity<Containable>, container: Entity<Container>) => flow(
  updateEntity(item.id, setContainerId(container.id)),
  updateEntity(container.id, addToContents(item.id))
)

/**
 * Effect that atomically updates a containable and container such that the containable is inside the container.
 * This effect does nothing if the item is not containable, the container is not a container, or neither
 * entity exists.
 */
export const placeInside = (
  itemOrId: UnresolvedEntity<Containable>,
  containerOrId: UnresolvedEntity<Container>
) => (state: WorldState) => {
  const item = resolveEntity(itemOrId, state).filter(isContainable) as Maybe<Entity<Containable>>
  const container = resolveEntity(containerOrId, state).filter(isContainer) as Maybe<Entity<Container>>

  return item.isNothing() || container.isNothing()
    ? state
    : createPlaceInsiderMutator(item.some(), container.some())(state)
}
