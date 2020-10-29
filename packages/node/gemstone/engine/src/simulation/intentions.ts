import { flow } from 'lodash'
import { get, reduce } from 'lodash/fp'

import { Point } from '../types'

import { handleArrival, moveTowards } from './movement'
import { Actor, StateContainer } from './state'

export interface MoveIntention {
  destination: Point
  type: 'move'
}

export interface WaitIntention {
  type: 'wait'
}

export const createMoveIntention = (x: number, y: number): MoveIntention => ({
  destination: { x, y },
  type: 'move',
})

export const createWaitIntention = (): WaitIntention => ({
  type: 'wait',
})

/** handles the outcome of a move intention, once time has advanced to the endSegment */
const handleMove = (actor: Actor, move: MoveIntention, endSegment: number) => (state: StateContainer) => {
  return flow(
    moveTowards(actor.id, move.destination, endSegment - (state.scene?.currentSegment ?? 0)),
    handleArrival(actor.id, move.destination, createWaitIntention())
  )(state)
}

/** handles the outcome of a wait intention, once time has advanced to the endSegment */
const handleWait = (_actor: Actor, _wait: WaitIntention, _endSegment: number) => (state: StateContainer) => state

export type Intention = MoveIntention
| WaitIntention

export type IntentionHandlerList = {
  [k in Intention['type']]: (actor: Actor, intention: any, endSegment: number) => (state: StateContainer) => StateContainer
}

const intentionHandlers: IntentionHandlerList = {
  move: handleMove,
  wait: handleWait,
}

const getIntentionHandler = (intention: Intention) => {
  const NOOP = (_actor: Actor, _wait: WaitIntention, _endSegment: number) => (state: StateContainer) => state
  return get(intention.type)(intentionHandlers) ?? NOOP
}

/** handles all actor intentions when the clock is advanced the specified number of segments */
export const handleIntentions = (state: StateContainer, segments: number): StateContainer => reduce((state: StateContainer, actor: Actor) => {
  return getIntentionHandler(actor.intention)(actor, actor.intention, (state.scene?.currentSegment ?? 0) + segments)(state)
})(state)(Q.actors(state))
