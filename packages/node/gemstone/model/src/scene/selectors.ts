import { filter, get, isEmpty, isUndefined, last, mapValues, negate, omit, size, values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { CharacterId, getPlayerCharactersCollection } from '../character'
import { createParameterSelector } from '../common'
import { Actor, ActorStatus, EMPTY_FRAME } from '../frame'
import { getSegmentDuration } from '../rules'

import { SceneStateContainer } from './state'

export interface SceneSelectorParameters {
  characterId?: CharacterId
}

const getCharacterIdParam = createParameterSelector((params: SceneSelectorParameters) => params.characterId)

/** scene selectors */
export const getScene = (state: SceneStateContainer) => state.scene ?? { }

// Get all frames in this scene
export const getFrames = createSelector(
  [getScene],
  (scene) => scene.frames ?? []
)

// Get the number of frames in this scene
export const getFrameCount = createSelector(
  [getFrames],
  (frames) => size(frames)
)

// Gets the number of the current frame
export const getCurrentFrameNumber = createSelector(
  [getFrames],
  (frames) => {
    return Math.max(size(frames), 1) - 1
  }
)

// Gets the current scene time, in seconds
export const getCurrentTime = createSelector(
  [getCurrentFrameNumber, getSegmentDuration],
  (frameNumber, segmentDuration) => frameNumber * segmentDuration
)

/** retrieves the current frame (i.e. the last one in the list) */
export const getCurrentFrame = createSelector(
  [getFrames],
  (frames) => isEmpty(frames) ? EMPTY_FRAME : last(frames)
)

export const getCharacterIds = createSelector(
  [getScene],
  (scene) => scene.characters ?? []
)

export const getActorStatusCollection = createSelector(
  [getCurrentFrame],
  (frame) => frame?.actors ?? {}
)

/** retrieves an unsorted array of the most recent status for all actors */
export const getActorStatuses = createSelector(
  [getActorStatusCollection],
  (actors) => values(actors)
)

/** retrieves the most recent status of the actor with the given character id */
export const getCurrentStatus = createSelector(
  [getActorStatusCollection, getCharacterIdParam],
  (actors, id) => id === undefined ? undefined : actors[id]
)

/** gets the position in the current frame for the actor withs the specified ID */
export const getCurrentPosition = createSelector(
  [getCurrentStatus],
  (status) => status?.position ?? undefined
)

/** gets the intention in the current frame for the actor withs the specified ID */
export const getCurrentIntention = createSelector(
  [getCurrentStatus],
  (status) => status?.intention ?? undefined
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
