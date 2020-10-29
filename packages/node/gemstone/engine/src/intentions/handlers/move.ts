import { GameState, Point } from '../../model'
import { getBaseSpeed } from '../../model/character'
import { ActorStatus } from '../../model/frame'
import { getNewPosition, SimulationActions } from '../../simulation'
import { SimulationContext } from '../types'

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const move = (actor: ActorStatus, context: SimulationContext<GameState>, destination: Point) => {
  // return flow(
  //   moveTowards(actor.id, move.destination, endSegment - (state.scene?.currentSegment ?? 0)),
  //   handleArrival(actor.id, move.destination, createWaitIntention())
  // )(state)

  const speed = getBaseSpeed(context.state, { characterId: actor.id })

  return SimulationActions.moved({
    characterId: actor.id,
    position: getNewPosition(actor.position, destination, speed, 1),
  })
}
