import { isString } from 'lodash/fp'

import { just, Maybe, none, NoValue } from '@thrashplay/fp/maybe'
import { Dictionary } from '@thrashplay/gemstone-model'

import { Entity, MightBe } from '../entity'
import { getEntity } from '../entity/selectors'
import { EntitiesContainer } from '../state'

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
  TResult extends unknown = any,
  TFacets extends Dictionary<string, any> = Dictionary<string, any>,
  TArgsType extends unknown = never,
  TArgs extends any[] = TArgsType extends never
    ? []
    : TArgsType extends any[] ? TArgsType : [TArgsType],
>(
  selector: (state: EntitiesContainer, entity: MightBe<TFacets>,
    ...args: TArgs) => Maybe<TResult>
) => (state: EntitiesContainer) =>
  (entityOrId: Maybe<MightBe<TFacets>> | MightBe<TFacets> | Entity['id'] | NoValue, ...args: TArgs) => {
    const entity = isString(entityOrId)
      ? getEntity<TFacets>(state)(entityOrId)
      : just(entityOrId)

    return entity.exists
      ? selector(state, entity.value as MightBe<TFacets>, ...args)
      : none<TResult>()
  }
