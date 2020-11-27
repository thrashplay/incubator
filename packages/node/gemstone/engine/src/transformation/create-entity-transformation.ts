import { head } from 'lodash'
import { identity } from 'lodash/fp'
import { createCustomAction } from 'typesafe-actions'

import { Entity } from '../entity'
import { createValidationChain } from '../validation/create-validation-chain'
import { Validator } from '../validation/validator'
import { WorldState, WorldStateBuilders } from '../world-state'

import { Transformation } from './transformation'
import { OptionalRestParameter } from './type-helpers'

const { updateEntity } = WorldStateBuilders

const NOOP_VALIDATOR = createValidationChain()

/**
 * Creates a typesafe Transformation creator for transformations that modify the state of a single entity.
 */
export const createEntityTransformation = <
  TType extends Transformation['type'] = Transformation['type'],
  TParameter extends any = never,
  TValidator extends Validator<Entity, Entity, string> = never,
  TInputEntity extends Entity = TValidator extends Validator<Entity, infer T, string>
    ? T
    : Entity,
  TOutputEntity extends Entity = Entity
>(
  type: TType,
  transformFunction: (entity: TInputEntity, ...parameter: OptionalRestParameter<TParameter>) => TOutputEntity,
  entityValidator: TValidator | undefined = undefined
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

export type EntityValidator<
  TInput extends Entity = any,
  TOutput extends TInput = any
> = (entity: TInput) => entity is TOutput
