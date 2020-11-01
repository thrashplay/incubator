import {
  CharacterId,
  FrameEvents,
} from '@thrashplay/gemstone-model'

import { createAction } from './create-action'

export const beginIdling = (characterId: CharacterId) => () =>
  FrameEvents.actionDeclared({
    characterId,
    action: createAction('idle'),
  })

/** Begins a move action for an actor */
export const beginMoving = (characterId: CharacterId, x: number, y: number) => () =>
  FrameEvents.actionDeclared({
    characterId,
    action: createAction('move', { x, y }),
  })
