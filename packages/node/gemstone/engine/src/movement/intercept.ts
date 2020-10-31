import {
  CharacterId,
  getPosition,
  isValidPoint,
} from '@thrashplay/gemstone-model'

import { error } from '../command-error-handler'
import { GameState } from '../state'

import { approachLocation } from './approach-location'
import { MovementOptions } from './options'

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
