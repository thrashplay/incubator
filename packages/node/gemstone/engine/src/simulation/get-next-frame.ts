import { flatten, flow, map, reduce, values } from 'lodash/fp'

import { ActorStatus, Frame, frameReducer, SimulationAction } from '@thrashplay/gemstone-model'

import { createIntentionHandler } from '../intentions/intentions'
import { GameState } from '../state'

export const getNextFrame = (frame: Frame, state: GameState) => {
  const handler = createIntentionHandler({
    frame,
    state,
  })

  const handleIntention = (actor: ActorStatus) => handler(actor, actor.intention)
  const intentionActions = flow(
    values,
    map(handleIntention),
    flatten
  )(frame.actors)

  return reduce((result: Frame, action: SimulationAction) => frameReducer(result, action))(frame)(intentionActions)
}
