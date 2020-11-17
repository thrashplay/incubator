import { curry, flow } from 'lodash/fp'

import { updateItem } from '@thrashplay/fp'
import { RecordSet } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'
import { EntitiesContainer } from '../state'

/**
 * A function that changes the state of an Entity, generally the result of an action taken upon or by it.
 */
export type Effect = (entity: Entity) => Entity

/**
 * Creates a restricted effect, which only applies the effect function to an entity that matches the supplied predicate.
 **/
export const applyIf = curry((
  filter: (entity: Entity) => boolean,
  effect: Effect
): Effect => (entity: Entity) => filter(entity) ? effect(entity) : entity)

/**
 * Creates a mutator that targets a specific entity with an effect.
 * The returned function updates a RecordSet of entities by applying the effect to the specific entity, if
 * it exists.
 **/
export const target = curry((
  targetId: Entity['id'],
  effect: Effect
) => (entities: RecordSet<Entity>): RecordSet<Entity> => updateItem(entities, targetId, effect))

/** Type for a targeted effect function. */
export type TargetedEffect = ReturnType<typeof target>

/** Applies a set of targeted effects, returning the new state. */
export const applyEffects = curry((effects: TargetedEffect[], state: EntitiesContainer): EntitiesContainer => ({
  ...state,
  entities: flow(...effects)(state.entities),
}))
