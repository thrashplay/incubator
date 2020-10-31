import { size } from 'lodash/fp'
import { createSelector } from 'reselect'

import { EMPTY_FRAME } from '../frame'

import { getFrameNumberParam, getScene } from './base'

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

export const getCurrentFrameNumber = createSelector(
  [getFrames],
  (frames) => Math.max(0, size(frames) - 1)
)

/** Gets the frame number from the frameNumber param, or uses the current frame by default */
export const getSelectedFrameNumber = createSelector(
  [getCurrentFrameNumber, getFrameNumberParam],
  (currentFrame, selectedFrame) => selectedFrame ?? currentFrame
)

/** retrieves the current frame (i.e. the last one in the list) */
export const getCurrentFrame = createSelector(
  [getFrames, getCurrentFrameNumber],
  (frames, index) => index >= size(frames) ? EMPTY_FRAME : frames[index]
)

/** retrieves the selected frame, as determined by getSelectedFrameNumber */
export const getSelectedFrame = createSelector(
  [getFrames, getSelectedFrameNumber],
  (frames, index) => index >= size(frames) ? EMPTY_FRAME : frames[index]
)
/** Gets the time, in seconds, of the current frame */
export const getTime = createSelector(
  [getSelectedFrame],
  (frame) => frame?.timeOffset ?? 0
)

/** Determines if the current frame is a 'key' frame or not */
export const isKeyFrame = createSelector(
  [getSelectedFrame],
  (frame) => frame.keyFrame
)
