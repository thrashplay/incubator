import { GameState } from '../../model/state'
import { Point } from '../../model/types'
import { Actor } from '../../simulation/state'
import { SimulationContext } from '../types'

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const move = (_actor: Actor, _context: SimulationContext<GameState>, _destination: Point) => {
  // return flow(
  //   moveTowards(actor.id, move.destination, endSegment - (state.scene?.currentSegment ?? 0)),
  //   handleArrival(actor.id, move.destination, createWaitIntention())
  // )(state)
  return []
}
