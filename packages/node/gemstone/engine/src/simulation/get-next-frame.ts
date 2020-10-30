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
import { Apply, createStore, Dispatchable } from '../store'

const calculateNextSegment = (state: GameState) => (
  currentFrame: Frame,
  apply: Apply<Frame, SimulationAction>
) => {
  const handleIntention = createIntentionHandler({
    frame: currentFrame,
    state,
  })

  const intentionActions = flow(
    values,
    map(handleIntention),
    flatten,
    concat(SimulationActions.timeOffsetChanged(currentFrame.timeOffset + getSegmentDuration(state)))
  )(currentFrame.actors)

  console.log('actions', intentionActions)

  const messageReducer = (_: Frame, message: Dispatchable<Frame, SimulationAction>) => apply(message)
  return reduce(messageReducer)(currentFrame)(intentionActions)
}

export const getNextFrame = (initialFrame: Frame, state: GameState): Frame => {
  const isIdle = (actor: ActorStatus) => actor.intention.type === 'idle'
  const anyActorsIdle = (currentFrame: Frame) => some(isIdle)(currentFrame.actors)

  const needsToPause = (currentFrame: Frame, forceStopAt: number) =>
    anyActorsIdle(currentFrame) || currentFrame.timeOffset >= forceStopAt

  const store = createStore(frameReducer, initialFrame)

  const getNextFrameRecursive = (currentFrame: Frame, forceStopAt: number): Frame => {
    const nextFrame = calculateNextSegment(state)(currentFrame, store.apply)

    return needsToPause(nextFrame, forceStopAt)
      ? nextFrame
      : getNextFrameRecursive(nextFrame, forceStopAt)
  }

  return getNextFrameRecursive(initialFrame, initialFrame.timeOffset + 60)
}
