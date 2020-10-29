import { ActorStatus, GameState } from '@thrashplay/gemstone-model'

import { SimulationContext } from '../types'

/** handles the outcome of a move intention, once time has advanced to the endSegment */
export const wait = (_actor: ActorStatus, _context: SimulationContext<GameState>) => []
