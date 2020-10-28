import { concat, contains, flow, get, initial, map, takeRight, uniq } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CharacterId } from '../character'
import { CommonAction, CommonActions } from '../common'

import { SceneAction, SceneActions } from './actions'
import { ActorStatus, Frame, SceneState } from './state'

export const EMPTY_FRAME: Frame = {
  actors: {},
}

export const reduceSceneState = (state: SceneState, action: SceneAction | CommonAction): SceneState => {
  switch (action.type) {
    case getType(CommonActions.initialized):
    case getType(SceneActions.sceneStarted):
      return {
        characters: [],
        frameOffset: 0,
        frames: [EMPTY_FRAME],
      }

    case getType(SceneActions.characterAdded):
      return contains(action.payload)(state.characters) ? state : flow(
        addCharacter(action.payload),
        setActorStatus(action.payload, createDefaultActorStatus(action.payload))
      )(state)

    case getType(SceneActions.intentionDeclared):
      return contains(action.payload.characterId)(state.characters)
        ? setActorStatus(action.payload.characterId, { intention: action.payload.intention })(state)
        : state

    case getType(SceneActions.moved):
      return contains(action.payload.characterId)(state.characters)
        ? setActorStatus(action.payload.characterId, { position: action.payload.position })(state)
        : state

    default:
      return state
  }
}

// state update helpers

/** creates the initial actor status for a character */
const createDefaultActorStatus = (id: CharacterId) => ({
  id,
  intention: { type: 'idle' },
  position: { x: 0, y: 0 },
})

/** applies a transformation to the last frame in state (i.e. the current frame) */
const updateCurrentFrame = (update: (frame: Frame) => Frame) => (state: SceneState) => ({
  ...state,
  frames: concat(initial(state.frames), map(update)(takeRight(1)(state.frames))),
})

/** updates state by adding a character id to the character list */
const addCharacter = (id: CharacterId) => (state: SceneState) => ({
  ...state,
  characters: uniq(concat(state.characters, id)),
})

/** updates the actor's status in the current frame */
const setActorStatus = (
  id: CharacterId,
  status: Partial<Omit<ActorStatus, 'id'>>
) => updateCurrentFrame((frame: Frame) => ({
  ...frame,
  actors: {
    ...frame?.actors,
    [id]: {
      ...get(id)(frame?.actors),
      ...status,
      id,
    },
  },
}))
