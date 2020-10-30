import _ from 'lodash'
import { castArray } from 'lodash/fp'

import {
  CharacterId,
  getBaseSpeed,
  getCurrentPosition,
  isValidPoint,
  Point,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { error } from '../../command-error-handler'
import { GameState } from '../../state'
import { Command } from '../../store'
import { getNextPositionOnApproach, hasArrived } from '../movement'

export interface MovementOptions {
  // minimum distance to try and maintain from a movement destination, defaults to zero
  minimumDistance: number

  // command to execute when a movement is completed, defaults to a noop
  onArrival: Command
}

const DEFAULT_OPTIONS: MovementOptions = {
  minimumDistance: 0,
  onArrival: () => [],
}

const withDefaults = (options: Partial<MovementOptions> = {}): MovementOptions => _.merge({}, options, DEFAULT_OPTIONS)

/** move the actor to the specified location */
export const moveTo = (characterId: CharacterId, position: Point) => (_state: GameState) => {
  console.log('m', position)
  return SimulationActions.moved({
    characterId,
    position,
  })
}

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
  const { minimumDistance, onArrival } = withDefaults(options)

  const position = getCurrentPosition(state, { characterId })
  const speed = getBaseSpeed(state, { characterId })

  const doApproach = (start: Point, end: Point) => {
    const nextPosition = getNextPositionOnApproach(start, end, speed, minimumDistance)
    const move = moveTo(characterId, nextPosition)

    return hasArrived(nextPosition, end)
      ? [move, ...castArray(onArrival)]
      : move
  }

  console.log('id:', characterId, 'pos', position, 'state', state)

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
  const targetPosition = getCurrentPosition(state, { characterId: targetId })
  return isValidPoint(targetPosition)
    ? [approachLocation(characterId, targetPosition, options)]
    : error('[intercept] Invalid input - targetPosition:', targetPosition)
}
