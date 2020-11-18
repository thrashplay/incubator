import { curry, filter, flow, has, isNil, map, negate } from 'lodash/fp'
import { Maybe } from 'monet'

import { createEntitySelector } from '../../api/create-entity-selector'
import { resolveEntity, UnresolvedEntity } from '../../api/resolve-entity'
import { AnyFacets, Entity, MightBe } from '../../entity'
import { EntitiesContainer } from '../../state'
import { Containable } from '../containable'
import { Container } from '../container'

/** Determines if an entity is a Container or not. */
export const isContainer = curry(<
  TFacets extends AnyFacets = AnyFacets
>(state: EntitiesContainer, entityOrId: UnresolvedEntity<TFacets>): boolean => {
  const entity = resolveEntity(entityOrId, state)
  return entity.map(has('contents')).orJust(false)
})

/** Retrieves the entity IDs for the contents of a container. */
export const getContentIds = createEntitySelector((
  _,
  entity: MightBe<Container>
): Maybe<Entity['id'][]> => {
  return isNil(entity.contents)
    ? Maybe.Nothing<string[]>()
    : Maybe.Just(entity.contents)
})

/** Retrieves the entity instances for the contents of a container. */
export const getContents = createEntitySelector((
  state,
  entity: MightBe<Container>
): Maybe<MightBe<Containable>[]> => {
  const lookupEntity = (entityId: string) => resolveEntity<Containable>(entityId, state)
  const extractValuesOrUndefined = <T>(maybe: Maybe<T>) => maybe.orUndefined()

  return isNil(entity.contents)
    ? Maybe.Nothing()
    : Maybe.Just(flow(
      map(lookupEntity),
      map(extractValuesOrUndefined),
      filter(negate(isNil))
    )(entity.contents))
})
