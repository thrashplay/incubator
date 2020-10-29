import { filter, get, isUndefined, mapValues, negate, omit, values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { getPlayerCharactersCollection } from '../../character'
import { Actor, ActorStatus } from '../../frame'

import { getCharacterIdParam, getScene } from './base'
import { getCurrentFrame } from './frames'

export const getCharacterIds = createSelector(
  [getScene],
  (scene) => scene.characters ?? []
)

export const getActorStatusCollection = createSelector(
  [getCurrentFrame],
  (frame) => frame?.actors ?? {}
)

export const getActorCollection = createSelector(
  [getActorStatusCollection, getPlayerCharactersCollection],
  (statuses, characters) => {
    const createActor = (status: ActorStatus): Actor => {
      const character = get(status.id)(characters)
      return character === undefined ? undefined : ({
        ...character,
        status: omit('id')(status),
        id: status.id,
      })
    }

    return mapValues(createActor)(statuses)
  }
)

export const getActors = createSelector(
  [getActorCollection],
  (actors) => filter<Actor>(negate(isUndefined))(values(actors))
)

/** gets a hydrated actor+character object by ID */
export const getActor = createSelector(
  [getCharacterIdParam, getActorCollection],
  (id, actors) => id === undefined ? undefined : actors[id]
)
