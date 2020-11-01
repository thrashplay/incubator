import { some, values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { getBaseSpeed } from '../../character'
import { getDefaultMovementMode, getMovementModesCollection } from '../../rules'
import { ActorStatus } from '../frame/state'

import { getActorStatusCollection } from './actor-list'
import { getCharacterIdParam } from './base'
import { getFrame } from './frames'

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
  (status) => status?.position ?? { x: 0, y: 0 }
)

/** gets the action in the current frame for the actor withs the specified ID */
export const getAction = createSelector(
  [getStatus],
  (status) => status?.action
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

export const getTarget = createSelector(
  [getStatus],
  (status) => status?.target
)

// export const getNextPosition = createSelector(
//   [getStatus],
//   (status) => status?.position ?? undefined
// )

const isIdle = (actor: ActorStatus) => actor.action.type === 'idle'
export const areAnyActorsIdle = createSelector(
  [getFrame],
  (frame) => some(isIdle)(frame.actors)
)
