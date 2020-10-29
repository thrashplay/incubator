import {
  EMPTY_FRAME,
  getCurrentFrame,
  SceneAction,
  SceneActions,
} from '@thrashplay/gemstone-model'

import { GameState } from '../state'

import { getNextFrame } from './get-next-frame'

export const calculateNextFrame = () => (state: GameState): SceneAction | SceneAction[] => {
  const currentFrame = getCurrentFrame(state)
  return SceneActions.frameAdded(currentFrame === undefined ? EMPTY_FRAME : getNextFrame(currentFrame, state))
}
