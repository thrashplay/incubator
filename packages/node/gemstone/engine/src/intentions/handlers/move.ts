import { isEmpty } from 'lodash/fp'

import { ActorStatus, Point, SimulationActions } from '@thrashplay/gemstone-model'

import { approachLocation, calculateDistance } from '../../simulation'
import { GameState } from '../../state'
import { createIntention } from '../intentions'
import { SimulationContext } from '../types'

const ARRIVAL_DISTANCE = 3

export const moveTowardsDestination = (actor: ActorStatus, destination: Point, state: GameState) => {
  return approachLocation(actor.id, destination, 0)(state)
}

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const move = (actor: ActorStatus, { state }: SimulationContext<GameState>, destination: Point) => {
  const moveAction = approachLocation(actor.id, destination, 0)(state)

  const beginIdlingAction = SimulationActions.intentionDeclared({
    characterId: actor.id,
    intention: createIntention('idle'),
  })

  return isEmpty(moveAction)
    ? []
    : (calculateDistance(moveAction[0].payload.position, destination) < ARRIVAL_DISTANCE)
      ? [...moveAction, beginIdlingAction]
      : moveAction
}
