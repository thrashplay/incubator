import { filter, flow, isEmpty, matches, negate, omit, reduce, toPairs } from 'lodash/fp'
import { createSelector } from 'reselect'

import { calculateSizeFromCharacter, CharacterId } from '../../character'
import { ORIGIN, Point } from '../../common'
import { calculateDistance } from '../../movement-utils'
import { Actor } from '../frame/state'

import { getActors } from './actor-list'
import { getPosition, getReach } from './actor-status'
import { getCharacterIdParam, getPositionParam } from './base'

export interface Distance {
  actorId: CharacterId
  distance: number
}

export type Distances = { [k in string]?: number }

/**
 * Calculates the distance between each actor and the point passed as a parameter.
 * The result is an object, with keys matching the actor IDs and the values being the distance from that
 * actor to the point.
 */
export const getDistances = createSelector(
  [getPositionParam, getActors],
  (position = ORIGIN, actors = []) => {
    const addActorDistance = (result: Distances, actor: Actor) => ({
      ...result,
      [actor.id]: calculateDistance(position, actor.status.position),
    })

    return reduce(addActorDistance)({})(actors)
  }
)

/**
 * Retrieves a 'Distance' object for the actor closes to the position parameter.
 * If the CharacterId parameter is specified, that actor will be omitted from consideration.
 **/
export const getClosestActor = createSelector(
  [getDistances, getCharacterIdParam],
  (distances, idToOmit): Distance => {
    const keepClosest = (result: Distance, [actorId, distance]: [CharacterId, number]) => {
      return distance < result.distance
        ? {
          actorId,
          distance,
        }
        : result
    }

    const distancesWithExclusion = idToOmit === undefined ? distances : omit(idToOmit)(distances)

    return flow(
      toPairs,
      reduce(keepClosest)(INITIAL_DISTANCE)
    )(distancesWithExclusion)
  }
)

const INITIAL_DISTANCE = {
  actorId: '',
  distance: Number.MAX_SAFE_INTEGER,
}

/** determines if an actor is in melee range, given an attacker's position and reach */
const isInRange = (position: Point, reach: number) => (target: Actor) => {
  const targetSize = calculateSizeFromCharacter(target)
  return calculateDistance(position, target.status.position) - targetSize + 1 <= reach
}

/** retrieves a list of all actors that can be reached in melee by the specified actor */
export const getReachableTargets = createSelector(
  [getCharacterIdParam, getPosition, getReach, getActors],
  (id, position, reach, actors) => flow(
    filter(negate(matches({ id }))),
    filter(isInRange(position, reach))
  )(actors)
)

/** determines whether an actor has any targets that are in range of an attack */
export const hasReachableTargets = createSelector(
  [getReachableTargets],
  (targets) => !isEmpty(targets)
)
