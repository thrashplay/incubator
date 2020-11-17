import { get, isNil } from 'lodash/fp'

import { just, Maybe, none } from '@thrashplay/fp/maybe'

import { EntitiesContainer } from '../state'

import { AnyFacets, Entity, MightBe } from './entity'

/** Maybe gets an entity from the game, by its id. */
export const getEntity = <
  TPossibleFacets extends AnyFacets = AnyFacets,
  TEntity extends Entity = MightBe<TPossibleFacets>
>(state: EntitiesContainer) => (id: Entity['id'] | undefined): Maybe<TEntity> =>
  isNil(id)
    ? none<TEntity>()
    : just(get(['entities', id], state) as TEntity | undefined)
