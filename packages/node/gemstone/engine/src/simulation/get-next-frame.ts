import { flatten, flow, map, reduce, values } from 'lodash/fp'

import { createIntentionHandler } from '../intentions/intentions'
import { ActorStatus, Frame, frameReducer } from '../model/frame'
import { SimulationAction } from '../model/frame/actions'
import { GameState } from '../model/state'

export const getNextFrame = (frame: Frame) => {
  const handler = createIntentionHandler({
    frame,
    // TODO: populate this
    state: 'not real value' as unknown as GameState,
  })

  const handleIntention = (actor: ActorStatus) => handler(actor, actor.intention)
  const intentionActions = flow(
    values,
    map(handleIntention),
    flatten
  )(frame.actors)

  return reduce((result: Frame, action: SimulationAction) => frameReducer(result, action))(frame)(intentionActions)
}
