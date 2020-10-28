import { times } from 'lodash/fp'

import { SceneActions } from '../actions'
import { getCurrentFrameNumber } from '../selectors'
import { SceneStateContainer } from '../state'

import { calculateNextFrame } from './calculate-next-frame'

/**
 * Calculates a range of frames, ending with the specified endFrame index.
 *
 * If 'startFrame' is specified it will be used as the last completed frame to use as the starting point for
 * frame calculation. This value is interpreted according to the following rules:
 *
 *   - if startFrame is the currentFrame, or a future frame, then all frames after the current frame will
 *     be calculated until the requested endFrame is reached
 *   - if startFrame is a previous frame, all frames after it will be removed from the scene before calculating
 *     new frames until 'endFrame' is reached.
 *   - if startFrame is not specified, the currentFrame index will be used
 *
 * If startFrame >= endFrame, then this command will not perform any action. Similarly, no action is performed
 * if either frame value is negative.
 */
export const calculateFrames = (endFrame: number, startFrame?: number) => (state: SceneStateContainer) => {
  const createCommandList = (count: number) => times(() => calculateNextFrame)(count)
  const calculateFrameRange = (startFrame: number, endFrame: number) => {
    const numberOfFramesToCalculate = Math.max(0, endFrame - startFrame)

    return (numberOfFramesToCalculate <= 0)
      ? []
      : createCommandList(numberOfFramesToCalculate)
  }

  const currentFrame = getCurrentFrameNumber(state)
  const initialFrame = Math.min(startFrame ?? currentFrame, currentFrame)
  const isValidRange = (endFrame >= 0) && (initialFrame >= 0)

  const createFrameCommands = calculateFrameRange(initialFrame, endFrame)
  return isValidRange
    ? (initialFrame < currentFrame)
      // rewind and replace
      ? [SceneActions.frameReverted(initialFrame), ...createFrameCommands]
      // add new frames
      : createFrameCommands
    : []
}
