import { EMPTY_FRAME } from '../../model/frame'
import { getCurrentFrame, SceneAction, SceneActions, SceneStateContainer } from '../../model/scene'
import { getNextFrame } from '../get-next-frame'

export const calculateNextFrame = () => (state: SceneStateContainer): SceneAction | SceneAction[] => {
  const currentFrame = getCurrentFrame(state)
  return SceneActions.frameAdded(currentFrame === undefined ? EMPTY_FRAME : getNextFrame(currentFrame))
}
