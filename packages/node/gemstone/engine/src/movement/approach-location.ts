import {
  CharacterId,
  getCurrentSpeed,
  getNextPositionOnApproach,
  getPosition,
  hasArrived,
  isValidPoint,
  Point,
} from '@thrashplay/gemstone-model'

import { error } from '../command-error-handler'
import { GameState } from '../state'

import { moveTo } from './move-to'
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
