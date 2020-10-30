import { size } from 'lodash'
import { concat, contains, drop, flow, get, take, uniq } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CharacterId } from '../character'
import { CommonAction, CommonActions } from '../common'

import { SceneAction, SceneActions } from './actions'
import { EMPTY_FRAME, FrameAction, FrameActions, frameReducer } from './frame'
import { SceneState } from './state'

export const reduceSceneState = (
  state: SceneState,
  action: SceneAction | FrameAction | CommonAction
): SceneState => {
  switch (action.type) {
    case getType(CommonActions.initialized):
    case getType(SceneActions.sceneStarted):
      return {
        characters: [],
        currentFrame: 0,
        frames: [EMPTY_FRAME],
      }

    case getType(SceneActions.characterAdded):
      return contains(action.payload)(state.characters) ? state : flow(
        addCharacter(action.payload),
        reduceCurrentFrame(FrameActions.actorAdded(action.payload))
      )(state)

    case getType(SceneActions.currentFrameChanged):
      return (action.payload < 0 || action.payload >= state.frames.length) ? state : {
        ...state,
        currentFrame: action.payload,
      }

    case getType(SceneActions.frameAdded):
      return {
        ...state,
        frames: concat(state.frames, action.payload),
      }

    case getType(SceneActions.truncated):
      return state.currentFrame < 0 || state.currentFrame >= size(state.frames) ? state : {
        ...state,
        frames: take(state.currentFrame + 1)(state.frames),
      }

    default:
      // apply frame reducer to the current frame
      return reduceCurrentFrame(action)(state)
  }
}

// state update helpers

const reduceCurrentFrame = (action: SceneAction | FrameAction | CommonAction) => (state: SceneState) => {
  const currentFrameNumber = state.currentFrame ?? 0
  const currentFrame = get(currentFrameNumber)(state.frames)
  const updatedFrame = currentFrame === undefined ? undefined : frameReducer(currentFrame, action as FrameAction)
  return currentFrame !== updatedFrame && updatedFrame !== undefined
    ? {
      ...state,
      frames: [
        ...take(currentFrameNumber)(state.frames),
        updatedFrame,
        ...drop(currentFrameNumber + 1)(state.frames),
      ],
    }
    : state
}

/** updates state by adding a character id to the character list */
const addCharacter = (id: CharacterId) => (state: SceneState) => ({
  ...state,
  characters: uniq(concat(state.characters, id)),
})
