import {
  getTime,
  isKeyFrame,
  SceneEvents,
} from '@thrashplay/gemstone-model'

import { GameState } from '../../state'

import { calculateNextSegment } from './calculate-next-segment'

/**
 * Runs the simulation by adding a new frame, and advancing time until one of the following conditions is reached:
 *
 *   - user input is required
 *   - the 'maxTime' (in seconds) has elapsed in the simulation
 */
export const run = (maxTime = 60) => (state: GameState) => {
  const simulateUntilKeyFrame =
    (forceStopAt: number) => (currentState: GameState) => {
      const keyFrame = isKeyFrame(currentState)
      const currentTime = getTime(currentState)
      const needsToPause = keyFrame || currentTime >= forceStopAt

      return !needsToPause
        ? [
          SceneEvents.frameCommitted(),
          calculateNextSegment,
          simulateUntilKeyFrame(forceStopAt),
        ]
        : []
    }

  const currentTime = getTime(state)
  return [
    SceneEvents.frameCommitted(),
    calculateNextSegment,
    simulateUntilKeyFrame(currentTime + maxTime),
  ]
}
