import { some, values } from 'lodash/fp'
import { createSelector } from 'reselect'

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

const isIdle = (actor: ActorStatus) => actor.intention.type === 'idle'
export const areAnyActorsIdle = createSelector(
  [getSelectedFrame],
  (frame) => some(isIdle)(frame.actors)
)
