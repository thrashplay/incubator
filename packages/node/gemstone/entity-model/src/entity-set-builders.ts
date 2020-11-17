import { addItem, BuilderFunction, createBuilder, updateItem } from '@thrashplay/fp'

import { Entity } from './entity'
import { EntitiesContainer } from './state'

/** Builds a minimal Game instance. */
export const buildEntitiesContainer = createBuilder((): EntitiesContainer => ({
  entities: {},
}))

/** Adds an entity to a game instance. */
const addEntity = (entity: Entity) => (state: EntitiesContainer) => ({
  ...state,
  entities: addItem(state.entities, entity),
})

/** Applies one or more update functions to an Entity in a game. */
const updateEntity = (
  id: Entity['id'],
  ...updaters: BuilderFunction<Entity>[]
) => (state: EntitiesContainer) => ({ ...state, entities: updateItem(state.entities, id, ...updaters) })

export const EntitySetBuilders = {
  addEntity,
  updateEntity,
}
