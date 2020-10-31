import {
  CharacterId,
  getCurrentSpeed,
  getPosition,
  isValidPoint,
  Point,
} from '@thrashplay/gemstone-model'

import { error } from '../command-error-handler'
import { GameState } from '../state'

import { moveTo } from './move-to'
import { getNextPositionOnApproach, hasArrived } from './movement-utils'
import { MovementOptions, withDefaultOptions } from './options'

/**
 * Move the actor as fast as possible towards destination, but keep the given minimum distance.
 *
 * @param characterId the ID of the character to move
 * @param destination the location to approach
 * @param onArrival command that will be executed if the character arrives, which should return actions to dispatch
 * @param minDistance the minimum distance to keep when approaching the location, which is zero by default
 **/
export const approachLocation = (
  characterId: CharacterId,
  destination: Point,
  options?: Partial<MovementOptions>
) => (state: GameState) => {
  const { minimumDistance, onArrival } = withDefaultOptions(options)

  const position = getPosition(state, { characterId })
  const speed = getCurrentSpeed(state, { characterId })

  const doApproach = (start: Point, end: Point) => {
    const nextPosition = getNextPositionOnApproach(start, end, speed, minimumDistance)
    const move = moveTo(characterId, nextPosition)

    return hasArrived(nextPosition, end)
      ? [move, onArrival]
      : move
  }

  return isValidPoint(position) && isValidPoint(destination)
    ? doApproach(position, destination)
    : error('[approachLocation] Invalid input - position:', position, 'destination:', destination)
}

/**
 * Move the actor with the given characterId as fast as possible on an intercept course with the actor
 * that has the given targetId, but keep the given minimum distance between them while approaching.
 *
 * See 'approachLocation' for information on the arguments to this function.
 **/
export const intercept = (
  characterId: CharacterId,
  targetId: CharacterId,
  options?: Partial<MovementOptions>
) => (state: GameState) => {
  const targetPosition = getPosition(state, { characterId: targetId })
  return isValidPoint(targetPosition)
    ? [approachLocation(characterId, targetPosition, options)]
    : error('[intercept] Invalid input - targetPosition:', targetPosition)
}
