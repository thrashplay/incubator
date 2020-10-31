import { isNil, size } from 'lodash'
import { concat, contains, flow, initial, last, take, uniq } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CharacterId } from '../character'
import { CommonAction, CommonActions, createReducerErrorHandler } from '../common'

import { SceneAction, SceneActions } from './actions'
import { EMPTY_FRAME, FrameAction, FrameActions, frameReducer } from './frame'
import { SceneState } from './state'

export const reduceSceneState = (
  state: SceneState,
  action: SceneAction | FrameAction | CommonAction
): SceneState => {
  const error = createReducerErrorHandler('scene', state)

  const reduceCurrentFrame = (action: SceneAction | FrameAction | CommonAction) => (state: SceneState) => {
    const currentFrame = last(state.frames) ?? EMPTY_FRAME
    const updatedFrame = currentFrame === undefined ? undefined : frameReducer(currentFrame, action as FrameAction)

    return updatedFrame === undefined
      ? error(action.type, 'Frame reducer returned undefined value.')
      : currentFrame === updatedFrame
        ? state // no change
        : {
          ...state,
          frames: [
            ...initial(state.frames),
            updatedFrame,
          ],
        }
  }

  switch (action.type) {
    case getType(CommonActions.initialized):
    case getType(SceneActions.sceneStarted):
      return {
        characters: [],
        frames: [EMPTY_FRAME],
      }

    case getType(SceneActions.characterAdded):
      return contains(action.payload)(state.characters)
        ? error(action.type, 'Character ID not found:', action.payload)
        : flow(
          addCharacter(action.payload),
          reduceCurrentFrame(FrameActions.actorAdded(action.payload))
        )(state)

    case getType(SceneActions.frameAdded):
      return isNil(action.payload)
        ? error(action.type, 'New frame is undefined.')
        : {
          ...state,
          frames: concat(state.frames, action.payload),
        }

    case getType(SceneActions.frameCommitted):
      return {
        ...state,
        frames: [...state.frames, {
          ...(last(state.frames) ?? EMPTY_FRAME),
          keyFrame: false,
        }],
      }

    case getType(SceneActions.truncated):
      return action.payload < 0 || action.payload >= size(state.frames)
        ? error(action.type, 'Invalid frame:', action.payload, ', frameCount:', size(state.frames))
        : {
          ...state,
          frames: take(action.payload + 1)(state.frames),
        }

    default:
      // apply frame reducer to the current frame
      return reduceCurrentFrame(action)(state)
  }
}

// state update helpers

/** updates state by adding a character id to the character list */
const addCharacter = (id: CharacterId) => (state: SceneState) => ({
  ...state,
  characters: uniq(concat(state.characters, id)),
})
