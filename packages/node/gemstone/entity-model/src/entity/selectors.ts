import { get, isNil } from 'lodash/fp'
import { Maybe } from 'monet'

import { EntitiesContainer } from '../state'

import { AnyFacets, Entity, MightBe } from './entity'

/** Maybe gets an entity from the game, by its id. */
export const getEntity = <
  TPossibleFacets extends AnyFacets = AnyFacets,
  TEntity extends Entity = MightBe<TPossibleFacets>
>(state: EntitiesContainer) => (id: Entity['id'] | undefined): Maybe<TEntity> => {
  const entity = isNil(id) ? undefined : get(['entities', id], state)

  return isNil(entity)
    ? Maybe.Nothing()
    : Maybe.Just(entity as TEntity)
}
