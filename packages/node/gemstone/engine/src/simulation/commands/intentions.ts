import {
  CharacterId,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { createIntention } from '../../intentions'

export const beginIdling = (characterId: CharacterId) => () =>
  SimulationActions.intentionDeclared({
    characterId,
    intention: createIntention('idle'),
  })

/** Begins a move action for an actor */
export const beginMoving = (characterId: CharacterId, x: number, y: number) => () =>
  SimulationActions.intentionDeclared({
    characterId,
    intention: createIntention('move', { x, y }),
  })
