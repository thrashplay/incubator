import { curry, filter, flow, has, isNil, map, negate } from 'lodash/fp'
import { Maybe } from 'monet'

import {
  AnyFacets,
  createEntitySelector,
  Entity,
  MightBe,
  resolveEntity,
  UnresolvedEntity,
  WorldState,
} from '@thrashplay/gemstone-engine'

import { Containable } from '../containable'
import { Container } from '../container'

/** Determines if an entity ID is associated with a Container or not. */
export const isContainerId = curry(<
  TFacets extends AnyFacets = AnyFacets
>(state: WorldState, entityOrId: UnresolvedEntity<TFacets>): boolean => {
  return resolveEntity(entityOrId, state)
    .map(isContainer)
    .orJust(false)
})

/** Determines if an entity is a Container or not. */
export const isContainer = (entity: MightBe<Container>): entity is Entity<Container> => has('contents')(entity)

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
