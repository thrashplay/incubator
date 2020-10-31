import { concat, flatten, flow, map, values } from 'lodash/fp'
import { Action } from 'typesafe-actions'

import { FrameActions, getCurrentFrame, getSegmentDuration } from '@thrashplay/gemstone-model'

import { createIntentionHandler } from '../../intentions'
import { GameState } from '../../state'
import { Command } from '../../store'
import { isInputRequired } from '../is-input-required'

const checkKeyFrame = (state: GameState) => {
  return isInputRequired(state) ? FrameActions.keyFrameMarked() : []
}

/**
 * Advances the simulation one segment's duration by updating the current frame to reflect all intentions.
 */
export const simulateNextSegment: Command<GameState, Action> = (state: GameState) => {
  const currentFrame = getCurrentFrame(state)

  const handleIntention = createIntentionHandler({
    frame: currentFrame,
    state,
  })

  return flow(
    values,
    map(handleIntention),
    flatten,
    concat([
      FrameActions.timeOffsetChanged(currentFrame.timeOffset + getSegmentDuration(state)),
      checkKeyFrame,
    ])
  )(currentFrame.actors)
}
