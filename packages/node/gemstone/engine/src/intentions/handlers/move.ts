import { ActorStatus, Point } from '@thrashplay/gemstone-model'

import { approachLocation, beginIdling } from '../../simulation'
import { GameState } from '../../state'
import { Command } from '../../store'
import { SimulationContext } from '../types'

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const move = (
  { id }: ActorStatus,
  _context: SimulationContext<GameState>,
  destination: Point
): ReturnType<Command> => {
  return approachLocation(
    id,
    destination,
    { onArrival: beginIdling(id) }
  )
}
