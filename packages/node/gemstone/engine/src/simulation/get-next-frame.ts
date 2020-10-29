import { concat, flatten, flow, map, reduce, some, values } from 'lodash/fp'

import {
  ActorStatus,
  Frame,
  frameReducer,
  getSegmentDuration,
  SimulationAction,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { createIntentionHandler } from '../intentions/intentions'
import { GameState } from '../state'

const calculateNextSegment = (frame: Frame, state: GameState) => {
  const handler = createIntentionHandler({
    frame,
    state,
  })

  const handleIntention = (actor: ActorStatus) => handler(actor, actor.intention)
  const intentionActions = flow(
    values,
    map(handleIntention),
    flatten,
    concat(SimulationActions.timeOffsetChanged(frame.timeOffset + getSegmentDuration(state)))
  )(frame.actors)

  return reduce((result: Frame, action: SimulationAction) => frameReducer(result, action))(frame)(intentionActions)
}

export const getNextFrame = (frame: Frame, state: GameState, forceStopAt?: number): Frame => {
  const isIdle = (actor: ActorStatus) => actor.intention.type === 'idle'
  const anyActorsIdle = (currentFrame: Frame) => some(isIdle)(currentFrame.actors)

  const needsToPause = (currentFrame: Frame) =>
    anyActorsIdle(currentFrame) || (forceStopAt !== undefined && currentFrame.timeOffset >= forceStopAt)

  const nextFrame = calculateNextSegment(frame, state)
  return needsToPause(nextFrame) ? nextFrame : getNextFrame(nextFrame, state, forceStopAt ?? frame.timeOffset + 60)
}
