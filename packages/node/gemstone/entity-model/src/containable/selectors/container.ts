import { curry, filter, flow, has, map } from 'lodash/fp'

import { exists, just, Maybe } from '@thrashplay/fp/maybe'

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
  return entity.fmap(has('contents')).orElse(false)
})

/** Retrieves the entity IDs for the contents of a container. */
export const getContentIds = createEntitySelector((
  _,
  entity: MightBe<Container>
): Maybe<Entity['id'][]> => {
  return just(entity.contents)
})

/** Retrieves the entity instances for the contents of a container. */
export const getContents = createEntitySelector((
  state,
  entity: MightBe<Container>
): Maybe<MightBe<Containable>[]> => {
  const lookupEntity = (entityId: string) => resolveEntity<Containable>(entityId, state)

  // TODO: need a much better way to get valid values out of a list
  const lookupEntities = (entityIds: string[]): MightBe<Containable>[] => flow(
    map(lookupEntity),
    filter(exists),
    map((maybe: Maybe<MightBe<Containable>>) => maybe.value)
  )(entityIds)

  const contents = just(entity.contents)
    .fmap(lookupEntities)

  return contents
})
