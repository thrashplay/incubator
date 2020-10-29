import { flow, has } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { isValidPoint } from '@thrashplay/gemstone-model'

import { CharacterId } from '../character'

import { ActorStatus, Frame } from '.'
import { SimulationAction, SimulationActions } from './actions'

export const frameReducer = (frame: Frame, action: SimulationAction): Frame => {
  switch (action.type) {
    case getType(SimulationActions.actorAdded):
      return has(action.payload)(frame.actors) ? frame : flow(
        setActorStatus(action.payload, createDefaultActorStatus(action.payload))
      )(frame)

    case getType(SimulationActions.intentionDeclared):
      return has(action.payload.characterId)(frame.actors)
        ? setActorStatus(action.payload.characterId, { intention: action.payload.intention })(frame)
        : frame

    case getType(SimulationActions.moved):
      return !isValidPoint(action.payload.position) ? frame : has(action.payload.characterId)(frame.actors)
        ? setActorStatus(action.payload.characterId, { position: action.payload.position })(frame)
        : frame

    case getType(SimulationActions.timeOffsetChanged):
      return action.payload < 0 ? frame : {
        ...frame,
        timeOffset: action.payload,
      }

    default:
      return frame
  }
}

// state update helpers

/** creates the initial actor status for a character */
const createDefaultActorStatus = (id: CharacterId) => ({
  id,
  intention: { type: 'idle' },
  position: { x: 0, y: 0 },
})

/** updates the actor's status in the current frame */
const setActorStatus = (
  id: CharacterId,
  status: Partial<Omit<ActorStatus, 'id'>>
) => (frame: Frame) => ({
  ...frame,
  actors: {
    ...frame.actors,
    [id]: {
      ...frame.actors[id],
      ...status,
      id,
    },
  },
})
