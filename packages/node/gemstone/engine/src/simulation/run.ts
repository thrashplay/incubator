import {
  getCurrentTime,
  isCurrentFrameKey,
} from '@thrashplay/gemstone-model'

import { GameState } from '../state'

import { calculateNextSegment } from './calculate-next-segment'

/**
 * Runs the simulation by advancing the current frame's time until one of the following conditions is reached:
 *
 *   - user input is required
 *   - the 'maxTime' (in seconds) has elapsed in the simulation
 */
export const run = (maxTime = 60) => (state: GameState) => {
  const simulateUntilKeyFrame =
    (forceStopAt: number) => (currentState: GameState) => {
      const isKeyFrame = isCurrentFrameKey(currentState)
      const currentTime = getCurrentTime(currentState)
      const needsToPause = isKeyFrame || currentTime >= forceStopAt

      return !needsToPause
        ? [calculateNextSegment, simulateUntilKeyFrame(forceStopAt)]
        : []
    }

  const currentTime = getCurrentTime(state)
  return [
    calculateNextSegment,
    simulateUntilKeyFrame(currentTime + maxTime),
  ]
}
