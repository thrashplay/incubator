import { addItem, BuilderFunction, createBuilder, updateItem } from '@thrashplay/fp'

import { Entity } from '../entity'

import { WorldState } from './world-state'

/** Builds a minimal Game instance. */
export const buildWorldState = createBuilder((): WorldState => ({
  entities: {},
}))

/** Adds an entity to a game instance. */
const addEntity = (entity: Entity) => (state: WorldState) => ({
  ...state,
  entities: addItem(state.entities, entity),
})

/** Applies one or more update functions to an Entity in a game. */
const updateEntity = (
  id: Entity['id'],
  ...updaters: BuilderFunction<Entity>[]
) => (state: WorldState) => ({ ...state, entities: updateItem(state.entities, id, ...updaters) })

export const WorldStateBuilders = {
  addEntity,
  updateEntity,
}
