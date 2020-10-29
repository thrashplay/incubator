import { ActorStatus, getBaseSpeed, Point, SimulationActions } from '@thrashplay/gemstone-model'

import { calculateDistance, getNewPosition } from '../../simulation'
import { GameState } from '../../state'
import { createIntention } from '../intentions'
import { SimulationContext } from '../types'

const ARRIVAL_DISTANCE = 3

export const moveTowardsDestination = (actor: ActorStatus, destination: Point, state: GameState) => {
  const speed = getBaseSpeed(state, { characterId: actor.id })
  const newPosition = getNewPosition(actor.position, destination, speed, 1)

  return SimulationActions.moved({
    characterId: actor.id,
    position: newPosition,
  })
}

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const move = (actor: ActorStatus, context: SimulationContext<GameState>, destination: Point) => {
  const moveAction = moveTowardsDestination(actor, destination, context.state)

  const beginIdlingAction = SimulationActions.intentionDeclared({
    characterId: actor.id,
    intention: createIntention('idle'),
  })

  return (calculateDistance(moveAction.payload.position, destination) < ARRIVAL_DISTANCE)
    ? [moveAction, beginIdlingAction]
    : moveAction
}
