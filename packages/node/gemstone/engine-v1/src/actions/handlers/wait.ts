import { ActorStatus } from '@thrashplay/gemstone-model'

import { GameState } from '../../state'
import { SimulationContext } from '../types'

/** handles the outcome of a move action, once time has advanced to the endSegment */
export const wait = (_actor: ActorStatus, _context: SimulationContext<GameState>) => []
