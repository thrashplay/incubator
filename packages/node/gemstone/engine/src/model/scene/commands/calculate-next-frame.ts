import { getNextFrame } from '../../../simulation/get-next-frame'
import { SceneAction, SceneActions } from '../actions'
import { getCurrentFrame } from '../selectors'
import { SceneStateContainer } from '../state'

export const calculateNextFrame = () => (state: SceneStateContainer): SceneAction | SceneAction[] => {
  return SceneActions.frameAdded(getNextFrame(getCurrentFrame(state)))
}
