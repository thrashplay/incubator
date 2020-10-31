import {
  CharacterId,
  FrameActions,
} from '@thrashplay/gemstone-model'

import { createIntention } from './create-intention'

export const beginIdling = (characterId: CharacterId) => () =>
  FrameActions.intentionDeclared({
    characterId,
    intention: createIntention('idle'),
  })

/** Begins a move action for an actor */
export const beginMoving = (characterId: CharacterId, x: number, y: number) => () =>
  FrameActions.intentionDeclared({
    characterId,
    intention: createIntention('move', { x, y }),
  })
