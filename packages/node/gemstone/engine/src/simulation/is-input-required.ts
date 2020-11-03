import { some } from 'lodash/fp'

import {
  Actor,
  areAnyActorsIdle,
  getActorsWhoAreMoving,
  getClosestActor,
} from '@thrashplay/gemstone-model'

import { GameState } from '../state'

/** Determines if the current frame requires input from any game participant */
export const isInputRequired = (state: GameState) => {
  // Determines if any actors are executing a 'move' action are close enough to any targets
  // that a single segment's worth of movement could engage.
  // In other words, are any actors at a decision point between 'continuing to move' or 'engaging a target'.
  const anyMovingActorsCouldEngage = () => {
    const actorsWhoAreMoving = getActorsWhoAreMoving(state)

    const getClosestTo = (actor: Actor) => ({
      ...getClosestActor(state, {
        characterId: actor.id,
        position: actor.status.position,
      }),
    })

    const couldEngageNextFrame = (actor: Actor) => {
      // TODO: derive this from stats
      return getClosestTo(actor)?.distance < 60
    }

    return some(couldEngageNextFrame)(actorsWhoAreMoving)
  }

  const anyIdle = areAnyActorsIdle(state)
  const anyCouldEngage = anyMovingActorsCouldEngage()

  return anyIdle || anyCouldEngage
}
