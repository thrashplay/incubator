import { some, values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { getBaseSpeed } from '../../character'
import { getDefaultMovementMode, getMovementModesCollection } from '../../rules'
import { ActorStatus } from '../frame/state'

import { getActorStatusCollection } from './actor-list'
import { getCharacterIdParam } from './base'
import { getSelectedFrame } from './frames'

/** retrieves an unsorted array of the most recent status for all actors */
export const getActorStatuses = createSelector(
  [getActorStatusCollection],
  (actors) => values(actors)
)

/** retrieves the most recent status of the actor with the given character id */
export const getStatus = createSelector(
  [getActorStatusCollection, getCharacterIdParam],
  (actors, id) => id === undefined ? undefined : actors[id]
)

/** gets the position in the current frame for the actor withs the specified ID */
export const getPosition = createSelector(
  [getStatus],
  (status) => status?.position ?? undefined
)

/** gets the intention in the current frame for the actor withs the specified ID */
export const getIntention = createSelector(
  [getStatus],
  (status) => status?.intention ?? undefined
)

/** returns the movement mode currently active for an actor */
export const getActiveMovementMode = createSelector(
  [getStatus, getMovementModesCollection, getDefaultMovementMode],
  (status, modes, defaultMode) => {
    return status?.movementMode === undefined || modes === undefined
      ? defaultMode
      : modes[status.movementMode] ?? defaultMode
  }
)

export const getCurrentSpeed = createSelector(
  [getBaseSpeed, getActiveMovementMode],
  (speed, mode) => mode === undefined ? speed : speed * mode.multiplier
)

// export const getNextPosition = createSelector(
//   [getStatus],
//   (status) => status?.position ?? undefined
// )

const isIdle = (actor: ActorStatus) => actor.intention.type === 'idle'
export const areAnyActorsIdle = createSelector(
  [getSelectedFrame],
  (frame) => some(isIdle)(frame.actors)
)
