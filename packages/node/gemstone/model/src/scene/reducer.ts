import { concat, contains, flow, initial, isNil, last, omit, omitBy, size, take, uniq } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CharacterId } from '../character'
import { CommonEvent, CommonEvents, createReducerErrorHandler } from '../common'

import { SceneEvent, SceneEvents } from './events'
import { EMPTY_FRAME, FrameEvent, FrameEvents, frameReducer } from './frame'
import { EMPTY_SCENE, SceneState } from './state'

export const reduceSceneState = (
  state: SceneState,
  event: SceneEvent | FrameEvent | CommonEvent
): SceneState => {
  const error = createReducerErrorHandler('scene', state)

  const reduceCurrentFrame = (event: SceneEvent | FrameEvent | CommonEvent) => (state: SceneState) => {
    const currentFrame = last(state.frames) ?? EMPTY_FRAME
    const updatedFrame = currentFrame === undefined ? undefined : frameReducer(currentFrame, event as FrameEvent)

    return updatedFrame === undefined
      ? error(event.type, 'Frame reducer returned undefined value.')
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

  switch (event.type) {
    case getType(CommonEvents.initialized):
    case getType(SceneEvents.sceneStarted):
      return {
        ...EMPTY_SCENE,
        characters: [],
        frames: [EMPTY_FRAME],
      }

    case getType(SceneEvents.characterAdded):
      return contains(event.payload)(state.characters)
        ? error(event.type, 'Character ID not found:', event.payload)
        : flow(
          addCharacter(event.payload),
          reduceCurrentFrame(FrameEvents.actorAdded(event.payload))
        )(state)

    case getType(SceneEvents.frameAdded):
      return isNil(event.payload)
        ? error(event.type, 'New frame is undefined.')
        : {
          ...state,
          frames: concat(state.frames, event.payload),
        }

    case getType(SceneEvents.frameCommitted):
      return {
        ...state,
        frames: [...state.frames, {
          ...(last(state.frames) ?? EMPTY_FRAME),
          keyFrame: false,
        }],
      }

    case getType(SceneEvents.frameTagged):
      return event.payload.frameNumber < 0 || event.payload.frameNumber >= size(state.frames)
        ? error(event.type, 'Invalid frame:', event.payload, ', frameCount:', size(state.frames))
        : {
          ...state,
          frameTags: {
            [event.payload.tag]: event.payload.frameNumber,
          },
        }

    case getType(SceneEvents.frameTagDeleted):
      return {
        ...state,
        frameTags: omit(event.payload)(state.frameTags),
      }

    case getType(SceneEvents.truncated):
      return event.payload < 0 || event.payload >= size(state.frames)
        ? error(event.type, 'Invalid frame:', event.payload, ', frameCount:', size(state.frames))
        : flow(
          truncateFrames(event.payload),
          updateTagsAfterTruncation
        )(state)

    default:
      // apply frame reducer to the current frame
      return reduceCurrentFrame(event)(state)
  }
}

// state update helpers

/** truncate frames by dropping all frames after the specified one */
const truncateFrames = (frameNumber: number) => (state: SceneState) => ({
  ...state,
  frames: take(frameNumber + 1)(state.frames),
})

/** clears the selected frame, if it points to a frame that we truncated */
const updateTagsAfterTruncation = (state: SceneState) => {
  const shouldTruncate = (value: number) => value > size(state.frames) - 1
  return {
    ...state,
    frameTags: omitBy(shouldTruncate)(state.frameTags),
  }
}

/** updates state by adding a character id to the character list */
const addCharacter = (id: CharacterId) => (state: SceneState) => ({
  ...state,
  characters: uniq(concat(state.characters, id)),
})
