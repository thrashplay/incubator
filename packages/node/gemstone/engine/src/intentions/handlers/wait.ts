import { GameState } from '../../model'
import { ActorStatus } from '../../model/frame'
import { SimulationContext } from '../types'

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const wait = (_actor: ActorStatus, _context: SimulationContext<GameState>) => []
