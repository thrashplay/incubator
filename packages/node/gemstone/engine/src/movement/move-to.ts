
import {
  CharacterId,
  FrameActions,
  Point,
} from '@thrashplay/gemstone-model'

import { GameState } from '../state'

/** move the actor to the specified location */
export const moveTo = (characterId: CharacterId, position: Point) => (_state: GameState) => {
  return FrameActions.moved({
    characterId,
    position,
  })
}
