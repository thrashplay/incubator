import { get, has, size } from 'lodash/fp'
import { createSelector } from 'reselect'

import { EMPTY_FRAME } from '../frame'

import { getFallbackParam, getFrameTagParam, getScene } from './base'

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

export const getFrameTags = createSelector(
  [getScene],
  (scene) => scene.frameTags
)

export const isValidFrameTag = createSelector(
  [getFrameTags, getFrameTagParam],
  (tags, tag) => tag !== undefined && has(tag)(tags)
)

export const getTaggedFrameNumber = createSelector(
  [getFrameTags, getFrameTagParam],
  (frameTags, tagName) =>
    tagName === undefined ? undefined : get(tagName)(frameTags) as number
)
/**
 * Gets a frame number from the selector parameters.
 *
 *   - if an existing frame tag was specified, that frame number is used
 *   - if a non-existing frame tag was specified, and fallback is true, the current frame is used
 *   - if a non-existing frame tag was specified, and fallback is false, 'undefined' is returned
 *   - if no frame tag is specified, the current frame is used
 */
export const getFrameNumber = createSelector(
  [getFrameTagParam, getTaggedFrameNumber, getCurrentFrameNumber, getFallbackParam],
  (tag, taggedFrameNumber, currentFrameNumber, fallback) =>
    tag === undefined
      ? currentFrameNumber
      : taggedFrameNumber !== undefined
        ? taggedFrameNumber
        : fallback ? currentFrameNumber : undefined
)

/** retrieves the current frame (i.e. the last one in the list) */
export const getCurrentFrame = createSelector(
  [getFrames, getCurrentFrameNumber],
  (frames, index) => index >= size(frames) ? EMPTY_FRAME : frames[index]
)

/**
 * Retrieves the frame, as determined by getRequestedFrameNumber selector.
 * This method returns an 'empty' frame if the frame number is undefined, so you should
 * check the frame number directly (or use the 'isValidFrameTag' selector directly) to verify
 * that you will get data for a specific frame tag.
 **/
export const getFrame = createSelector(
  [getFrames, getFrameNumber],
  (frames, index) =>
    index === undefined
      ? EMPTY_FRAME
      : index >= size(frames) ? EMPTY_FRAME : frames[index]
)

/** Gets the time, in seconds, of the current frame */
export const getTime = createSelector(
  [getFrame],
  (frame) => frame?.timeOffset ?? 0
)

/** Determines if the current frame is a 'key' frame or not */
export const isKeyFrame = createSelector(
  [getFrame],
  (frame) => frame.keyFrame
)
