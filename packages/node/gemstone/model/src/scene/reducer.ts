import { flow, isNil, last, omit, omitBy, size, take, tap } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents, createReducerErrorHandler } from '../common'

import { buildScene, SceneBuilder } from './builders'
import { SceneEvent, SceneEvents } from './events'
import { EMPTY_FRAME, Frame, FrameEvent, FrameEvents, frameReducer } from './frame'
import { Scene } from './state'

const { addCharacter, addFrame, updateCurrentFrame } = SceneBuilder

export const reduceSceneState = (
  state: Scene,
  event: SceneEvent | FrameEvent | CommonEvent
): Scene => {
  const error = createReducerErrorHandler('scene', state)

  // const reduceCurrentFrame = (event: SceneEvent | FrameEvent | CommonEvent) => (state: Scene) => {
  //   const currentFrame = last(state.frames) ?? EMPTY_FRAME
  //   const updatedFrame = currentFrame === undefined ? undefined : frameReducer(currentFrame, event as FrameEvent)

  //   return updatedFrame === undefined
  //     ? error(event.type, 'Frame reducer returned undefined value.')
  //     : currentFrame === updatedFrame
  //       ? state // no change
  //       : {
  //         ...state,
  //         frames: [
  //           ...initial(state.frames),
  //           updatedFrame,
  //         ],
  //       }
  // }

  const reduceCurrentFrame = (event: SceneEvent | FrameEvent | CommonEvent) => (frame: Frame) => {
    return frameReducer(frame, event as FrameEvent)
  }

  switch (event.type) {
    case getType(CommonEvents.initialized):
    case getType(SceneEvents.sceneStarted):
      return buildScene()

    case getType(SceneEvents.characterAdded):
      return flow(
        addCharacter(event.payload),
        updateCurrentFrame(reduceCurrentFrame(FrameEvents.actorAdded(event.payload)))
      )(state)

    case getType(SceneEvents.frameAdded):
      return isNil(event.payload)
        ? error(event.type, 'New frame is undefined.')
        : addFrame(event.payload)(state)

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
      return updateCurrentFrame(reduceCurrentFrame(event))(state)
  }
}

// state update helpers

/** truncate frames by dropping all frames after the specified one */
const truncateFrames = (frameNumber: number) => (state: Scene) => ({
  ...state,
  frames: take(frameNumber + 1)(state.frames),
})

/** clears the selected frame, if it points to a frame that we truncated */
const updateTagsAfterTruncation = (state: Scene) => {
  const shouldTruncate = (value: number) => value > size(state.frames) - 1
  return {
    ...state,
    frameTags: omitBy(shouldTruncate)(state.frameTags),
  }
}
