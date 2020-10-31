import { ActorStatus, CharacterId, FrameActions, getBaseSpeed } from '@thrashplay/gemstone-model'

import { calculateDistance, getNewPosition } from '../../simulation'
import { GameState } from '../../state'
import { SimulationContext } from '../types'

const ARRIVAL_DISTANCE = 3

/** handles the outcome of a follow intention */
export const follow = (actor: ActorStatus, context: SimulationContext<GameState>, targetId: CharacterId) => {
  const speed = getBaseSpeed(context.state, { characterId: actor.id })
  const destination = context.frame.actors[targetId]?.position ?? actor.position

  return (calculateDistance(destination, actor.position) > ARRIVAL_DISTANCE)
    ? FrameActions.moved({
      characterId: actor.id,
      position: getNewPosition(actor.position, destination, speed, 1),
    }) : []
}
