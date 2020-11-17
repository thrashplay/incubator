import { get, isNil } from 'lodash/fp'

import { just, Maybe, none } from '@thrashplay/fp/maybe'
import { Dictionary } from '@thrashplay/gemstone-model'

import { EntitiesContainer } from '../state'

import { Entity, MightBe } from './entity'

/** Maybe gets an entity from the game, by its id. */
export const getEntity = <
  TPossibleFacets extends Dictionary<string, any> = never,
  TEntity extends Entity = [TPossibleFacets] extends [never] ? Entity : MightBe<TPossibleFacets>
>(state: EntitiesContainer) => (id: Entity['id'] | undefined): Maybe<TEntity> =>
  isNil(id)
    ? none<TEntity>()
    : just(get(['entities', id], state) as TEntity | undefined)
