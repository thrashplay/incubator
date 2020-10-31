import { concat, flatten, flow, map, values } from 'lodash/fp'

import {
  FrameActions,
  getCurrentFrame,
  getCurrentTime,
  getSegmentDuration,
  isCurrentFrameKey,
} from '@thrashplay/gemstone-model'

import { Action } from '../action'
import { createIntentionHandler } from '../intentions/intentions'
import { GameState } from '../state'
import { CommandResult } from '../store'

const calculateNextSegment = (state: GameState): CommandResult<GameState, Action> => {
  const currentFrame = getCurrentFrame(state)

  const handleIntention = createIntentionHandler({
    frame: currentFrame,
    state,
  })

  return flow(
    values,
    map(handleIntention),
    flatten,
    concat(FrameActions.timeOffsetChanged(currentFrame.timeOffset + getSegmentDuration(state)))
  )(currentFrame.actors)
}

export const runSimulation = () => (state: GameState) => {
  const simulateUntilKeyFrame =
    (forceStopAt: number) => (currentState: GameState): CommandResult<GameState, Action> => {
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
    simulateUntilKeyFrame(currentTime + 60),
  ]
}
