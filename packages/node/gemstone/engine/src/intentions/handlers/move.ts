import { ActorStatus, getBaseSpeed, Point, SimulationActions } from '@thrashplay/gemstone-model'

import { calculateDistance, getNewPosition } from '../../simulation'
import { GameState } from '../../state'
import { createIntention } from '../intentions'
import { SimulationContext } from '../types'

const ARRIVAL_DISTANCE = 3

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const move = (actor: ActorStatus, context: SimulationContext<GameState>, destination: Point) => {
  const speed = getBaseSpeed(context.state, { characterId: actor.id })
  const newPosition = getNewPosition(actor.position, destination, speed, 1)

  const move = SimulationActions.moved({
    characterId: actor.id,
    position: newPosition,
  })
  const stop = SimulationActions.intentionDeclared({
    characterId: actor.id,
    intention: createIntention('idle'),
  })

  return (calculateDistance(newPosition, destination) < ARRIVAL_DISTANCE)
    ? [move, stop]
    : move
}
