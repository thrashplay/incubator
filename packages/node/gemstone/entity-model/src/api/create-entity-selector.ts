import { Maybe } from 'monet'

import { NoValue } from '@thrashplay/fp/maybe'

import { AnyFacets, Entity, MightBe } from '../entity'
import { EntitiesContainer } from '../state'

import { resolveEntity } from './resolve-entity'

/**
 * Creates a flexible selector for entity data that may or may not exist. The created selector has the
 * following properties:
 *
 *   - can be called with either an Entity ID, an Entity instance, or a Maybe<Entity>
 *   - if called with an invalid entity ID, or an empty Maybe, will return Nothing
 *
 * To create a selector, you need to supply a select function with the following properties:
 *
 *   - takes a 'Game' instance as the first parameter
 *   - takes an Entity (or, specific faceted MightBe) as the second argument
 *   - takes zero or more additional arguments
 *   - returns a Maybe
 */
export const createEntitySelector = <
  TResult extends NonNullable<unknown> = any,
  TFacets extends AnyFacets = AnyFacets,
  TArgsType extends unknown = never,
  TArgs extends any[] = TArgsType extends never
    ? []
    : TArgsType extends any[] ? TArgsType : [TArgsType],
>(
  selector: (state: EntitiesContainer, entity: MightBe<TFacets>, ...args: TArgs) => Maybe<TResult>
) => (state: EntitiesContainer) =>
  (entityOrId: Maybe<MightBe<TFacets>> | MightBe<TFacets> | Entity['id'] | NoValue, ...args: TArgs) => {
    const entity = resolveEntity(entityOrId, state)

    return entity.chain((entity: MightBe<TFacets>) => selector(state, entity, ...args))
  }
