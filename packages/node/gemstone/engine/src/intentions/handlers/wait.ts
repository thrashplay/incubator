import { GameState } from '../../model/state'
import { Actor } from '../../simulation/state'
import { SimulationContext } from '../types'

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const wait = (_actor: Actor, _context: SimulationContext<GameState>) => []
