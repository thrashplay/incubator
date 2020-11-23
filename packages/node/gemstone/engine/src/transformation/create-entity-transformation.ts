import { head } from 'lodash'
import { createCustomAction } from 'typesafe-actions'

import { Entity } from '../entity'
import { WorldState, WorldStateBuilders } from '../world-state'

import { Transformation } from './transformation'
import { OptionalRestParameter } from './type-helpers'

const { updateEntity } = WorldStateBuilders

/**
 * Creates a typesafe Transformation creator for transformations that modify the state of a single entity.
 */
export const createEntityTransformation = <
  TType extends Transformation['type'] = Transformation['type'],
  TParameter extends any = never
>(
  type: TType,
  transformFunction: (entity: Entity, ...parameter: OptionalRestParameter<TParameter>) => Entity
) => createCustomAction(type, (
  entityId: Entity['id'],
  ...rest: OptionalRestParameter<TParameter>
) => {
  return {
    transformFunction: (world: WorldState, ...parameter: OptionalRestParameter<TParameter>) => {
      const transformWithParameter = (entity: Entity) => transformFunction(entity, ...parameter)
      return updateEntity(entityId, transformWithParameter)(world)
    },
    parameter: head(rest) as TParameter,
  } as unknown as Omit<Transformation<TType, TParameter>, 'type'>
})
