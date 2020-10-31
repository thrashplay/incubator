import { ActorStatus, CharacterId, FrameActions, getCurrentSpeed } from '@thrashplay/gemstone-model'

import { calculateDistance, getNewPosition } from '../../movement'
import { GameState } from '../../state'
import { SimulationContext } from '../types'

const ARRIVAL_DISTANCE = 3

/** handles the outcome of a follow intention */
export const follow = (actor: ActorStatus, context: SimulationContext<GameState>, targetId: CharacterId) => {
  const speed = getCurrentSpeed(context.state, { characterId: actor.id })
  const destination = context.frame.actors[targetId]?.position ?? actor.position

  return (calculateDistance(destination, actor.position) > ARRIVAL_DISTANCE)
    ? FrameActions.moved({
      characterId: actor.id,
      position: getNewPosition(actor.position, destination, speed, 1),
    }) : []
}
