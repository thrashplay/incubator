
import { ActorStatus, Point } from '@thrashplay/gemstone-model'

import { MovementCommands } from '../../commands/movement'
import { GameState } from '../../state'
import { Command } from '../../store'
import { beginIdling } from '../commands'
import { SimulationContext } from '../types'

/** handles the outcome of a move action, once time has advanced to the endSegment */
export const move = (
  { id }: ActorStatus,
  _context: SimulationContext<GameState>,
  destination: Point
): ReturnType<Command> => {
  return MovementCommands.approachLocation(
    id,
    destination,
    { onArrival: beginIdling(id) }
  )
}
