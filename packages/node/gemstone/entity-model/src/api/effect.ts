import { curry, flow } from 'lodash/fp'

import { updateItem } from '@thrashplay/fp'
import { RecordSet } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'
import { EntitiesContainer } from '../state'

/**
 * A function that changes the state of an Entity, generally the result of an action taken upon or by it.
 */
export type EntityEffect = (entity: Entity) => Entity

/** A function that changes the state of the simulation by updating one or more entities. */
export type Effect = (entities: RecordSet<Entity>) => RecordSet<Entity>

/**
 * Creates a restricted effect, which only applies the effect function to an entity that matches the supplied predicate.
 **/
export const applyIf = curry((
  filter: (entity: Entity) => boolean,
  effect: EntityEffect
): EntityEffect => (entity: Entity) => filter(entity) ? effect(entity) : entity)

/**
 * Creates an effect that updates a single Entity by applying the specified EntityEffect to it.
 **/
export const effectSingle = curry((
  targetId: Entity['id'],
  effect: EntityEffect
) => (entities: RecordSet<Entity>): RecordSet<Entity> => updateItem(entities, targetId, effect))

/** Applies a set of targeted effects, returning the new state. */
export const applyEffects = curry((effects: Effect[], state: EntitiesContainer): EntitiesContainer => ({
  ...state,
  entities: flow(...effects)(state.entities),
}))
