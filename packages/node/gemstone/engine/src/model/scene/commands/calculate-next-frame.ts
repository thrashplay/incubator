import { SceneAction, SceneActions } from '../actions'
import { EMPTY_FRAME } from '../reducer'
import { SceneStateContainer } from '../state'

export const calculateNextFrame = () => (_state: SceneStateContainer): SceneAction | SceneAction[] => {
  return SceneActions.frameAdded(EMPTY_FRAME)
}
