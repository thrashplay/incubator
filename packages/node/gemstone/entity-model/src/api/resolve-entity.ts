import { isString } from 'lodash/fp'

import { just, Maybe, NoValue } from '@thrashplay/fp/maybe'

import { AnyFacets, Entity, MightBe } from '../entity'
import { getEntity } from '../entity/selectors'
import { EntitiesContainer } from '../state'

/** Represents the flexible entity input format handled by 'resolveEntity'. */
export type UnresolvedEntity<
  TFacets extends AnyFacets = AnyFacets
> = Maybe<MightBe<TFacets>> | MightBe<TFacets> | Entity['id'] | NoValue

/**
 * Resolves a variety of entity input formats into a Maybe<MightBe<TFacets>>, allowing flexible APIs that take any of
 * the following formats for an entity input:
 *
 *   - the entity ID
 *   - a raw Entity instance, that MightBe an instance with the desired facets
 *   - a Maybe object, wrapping the above -- or Nothing
 *   - NoValue, that is null or undefined
 *
 * Given one of the above, this will return a Maybe wrapping the resolved entity -- or nothing.
 */
export const resolveEntity = <
  TFacets extends AnyFacets = AnyFacets,
>(entityOrId: UnresolvedEntity<TFacets>, state: EntitiesContainer) => {
  return isString(entityOrId)
    ? getEntity<TFacets>(state)(entityOrId)
    : just(entityOrId)
}
