import { flow, has } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { createReducerErrorHandler, isValidPoint } from '@thrashplay/gemstone-model'

import { CharacterId } from '../../character'

import { ActorStatus, Frame } from '.'
import { FrameEvent, FrameEvents } from './events'

export const frameReducer = (frame: Frame, event: FrameEvent): Frame => {
  const error = createReducerErrorHandler('frame', frame)

  switch (event.type) {
    case getType(FrameEvents.actorAdded):
      return has(event.payload)(frame.actors)
        ? error(event.type, 'Actor is already in the scene:', event.payload)
        : flow(
          setActorStatus(event.payload, createDefaultActorStatus(event.payload))
        )(frame)

    case getType(FrameEvents.actionDeclared):
      return !has(event.payload.characterId)(frame.actors)
        ? error(event.type, 'Actor not found:', event.payload.characterId)
        : setActorStatus(event.payload.characterId, { action: event.payload.action })(frame)

    case getType(FrameEvents.keyFrameMarked):
      return {
        ...frame,
        keyFrame: true,
      }

    case getType(FrameEvents.moved):
      return !isValidPoint(event.payload.position)
        ? error(event.type, 'Invalid destination:', event.payload.position)
        : has(event.payload.characterId)(frame.actors)
          ? setActorStatus(event.payload.characterId, { position: event.payload.position })(frame)
          : error(event.type, 'Invalid actor ID:', event.payload.characterId)

    case getType(FrameEvents.movementModeChanged):
      return !has(event.payload.characterId)(frame.actors)
        ? error(event.type, 'Actor not found:', event.payload.characterId)
        : setActorStatus(event.payload.characterId, { movementMode: event.payload.mode })(frame)

    case getType(FrameEvents.timeOffsetChanged):
      return event.payload < 0 ? frame : {
        ...frame,
        timeOffset: event.payload,
      }

    default:
      return frame
  }
}

// state update helpers

/** creates the initial actor status for a character */
const createDefaultActorStatus = (id: CharacterId) => ({
  id,
  action: { type: 'idle' },
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
