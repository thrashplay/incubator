import { areAnyActorsIdle } from '@thrashplay/gemstone-model'

import { GameState } from '../state'

/** Determines if the current frame requires input from any game participant */
export const isInputRequired = (state: GameState) => {
  return areAnyActorsIdle(state)
}
