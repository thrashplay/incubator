import { concat, contains, flow, initial, last, take, uniq } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CharacterId } from '../character'
import { CommonAction, CommonActions } from '../common'
import { EMPTY_FRAME, frameReducer, SimulationAction, SimulationActions } from '../frame'

import { SceneAction, SceneActions } from './actions'
import { SceneState } from './state'

export const reduceSceneState = (
  state: SceneState,
  action: SceneAction | SimulationAction | CommonAction
): SceneState => {
  switch (action.type) {
    case getType(CommonActions.initialized):
    case getType(SceneActions.sceneStarted):
      return {
        characters: [],
        frames: [EMPTY_FRAME],
      }

    case getType(SceneActions.characterAdded):
      return contains(action.payload)(state.characters) ? state : flow(
        addCharacter(action.payload),
        reduceCurrentFrame(SimulationActions.actorAdded(action.payload))
      )(state)

    case getType(SceneActions.frameAdded):
      return {
        ...state,
        frames: concat(state.frames, action.payload),
      }

    case getType(SceneActions.frameReverted):
      return (action.payload < 0 || action.payload >= state.frames.length - 1) ? state : {
        ...state,
        frames: take(action.payload + 1)(state.frames),
      }

    default:
      // apply simulation reducer
      return reduceCurrentFrame(action)(state)
  }
}

// state update helpers

const reduceCurrentFrame = (action: SceneAction | SimulationAction | CommonAction) => (state: SceneState) => {
  const currentFrame = last(state.frames)
  const updatedFrame = currentFrame === undefined ? undefined : frameReducer(currentFrame, action as SimulationAction)
  return currentFrame !== updatedFrame && updatedFrame !== undefined
    ? { ...state, frames: [...initial(state.frames), updatedFrame] }
    : state
}

/** updates state by adding a character id to the character list */
const addCharacter = (id: CharacterId) => (state: SceneState) => ({
  ...state,
  characters: uniq(concat(state.characters, id)),
})
