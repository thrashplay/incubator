
import {
  CharacterId,
  FrameEvents,
  Point,
} from '@thrashplay/gemstone-model'

import { GameState } from '../../state'

/** move the actor to the specified location */
export const moveTo = (characterId: CharacterId, position: Point) => (_state: GameState) => {
  return FrameEvents.moved({
    characterId,
    position,
  })
}
