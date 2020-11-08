import { flatten, flow, map, values } from 'lodash/fp'

import { FrameEvents, getCurrentFrame, getSegmentDuration } from '@thrashplay/gemstone-model'

import { createActionHandler } from '../../actions'
import { Event } from '../../events'
import { GameState } from '../../state'
import { Command, Dispatchable } from '../../store'

import { isInputRequired } from './is-input-required'

const checkKeyFrame = (state: GameState) => {
  return isInputRequired(state) ? FrameEvents.keyFrameMarked() : []
}

/**
 * Advances the simulation one segment's duration by updating the current frame to reflect all actions.
 */
export const calculateNextSegment: Command<GameState, Event> = (state: GameState) => {
  const currentFrame = getCurrentFrame(state)

  const handleAction = createActionHandler({
    frame: currentFrame,
    state,
  })

  const finishFrame = (dispatchables: Dispatchable) => [
    ...dispatchables,
    FrameEvents.timeOffsetChanged(currentFrame.timeOffset + getSegmentDuration(state)),
    checkKeyFrame,
  ]

  return flow(
    values,
    map(handleAction),
    flatten,
    finishFrame
  )(currentFrame.actors)
}
