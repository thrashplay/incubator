import {
  SceneEvents,
} from '@thrashplay/gemstone-model'

import { GameState } from '../../state'

import { calculateNextSegment } from './calculate-next-segment'

/**
 * Runs the simulation by adding a new frame, and advancing time for a single segment.
 */
export const runSingleSegment = () => (_: GameState) => {
  return [
    SceneEvents.frameCommitted(),
    calculateNextSegment,
  ]
}
