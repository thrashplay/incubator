import { size } from 'lodash/fp'
import { createSelector } from 'reselect'

import { EMPTY_FRAME } from '../frame'

import { getScene } from './base'

// Get all frames in this scene
export const getFrames = createSelector(
  [getScene],
  (scene) => scene.frames ?? []
)

// Get the number of frames in this scene
export const getFrameCount = createSelector(
  [getFrames],
  (frames) => size(frames)
)

// Gets the number of the current frame
export const getCurrentFrameNumber = createSelector(
  [getFrames],
  (frames) => Math.max(0, size(frames) - 1)
)

/** retrieves the current frame (i.e. the last one in the list) */
export const getCurrentFrame = createSelector(
  [getFrames, getCurrentFrameNumber],
  (frames, index) => index >= size(frames) ? EMPTY_FRAME : frames[index]
)

// Gets the current scene time, in seconds
export const getCurrentTime = createSelector(
  [getCurrentFrame],
  (frame) => frame?.timeOffset ?? 0
)

/** determines if the current frame is a 'key' frame or not */
export const isCurrentFrameKey = createSelector(
  [getCurrentFrame],
  (frame) => frame.keyFrame
)
