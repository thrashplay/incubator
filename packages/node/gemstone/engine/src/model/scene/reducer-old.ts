import { concat, filter, flow, get, head, init, initial, isUndefined, keyBy, map, matches, negate, omit, pickBy, takeRight } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import * as CharacterModel from '../character'
import { Character, CharacterId } from '../character/state'
import { CommonAction, CommonActions } from '../common/action'
import { GemstoneState } from '../state'

import { SceneAction, SceneActions } from './actions'
import { createWaitIntention, Intention } from './intentions'
import { Actor, ActorId, SceneFrame, SceneState, SceneStateContainer } from './state'

const updateActor = (actor?: Actor) => (updater: (original: Actor) => Actor) => (model: GemstoneState): GemstoneState => ({
  ...model,
  scene: model.scene === undefined ? undefined : {
    ...model.scene,
    currentFrame: {
      ...model.scene.currentFrame,
      actors: actor ? {
        ...model.scene?.currentFrame?.actors,
        [actor.id]: updater(actor),
      } : model.scene.currentFrame.actors,
    },
  },
})

const updateActorWithIntention = (intention: Intention | undefined) => (actor: Actor) => ({
  ...actor,
  intention: intention ?? createWaitIntention(),
})

const setIntention = (actor: Actor | undefined, intention: Intention | undefined): (state: GemstoneState) => GemstoneState =>
  updateActor(actor)(updateActorWithIntention(intention))

/** creates an initial frame, containing actors for the specified list of characters */
const createInitialFrame = (characterIds: CharacterId[], state: SceneStateContainer): SceneFrame => {
  const defaultMovementModeId = Rules.Q.defaultMovementMode(state).id

  const lookupCharacter = (characterId: CharacterId) => CharacterModel.getPlayerCharacter(state, { characterId })

  const createActor = (character: Character): Actor => ({
    ...character,
    intention: createWaitIntention(),
    movementModeId: defaultMovementModeId,
    position: { x: 0, y: 0 },
  })

  const getId = (actor: Actor) => actor?.id ?? ''

  const actors = flow(
    map(lookupCharacter),
    filter(negate(isUndefined)),
    map(createActor),
    keyBy(getId)
  )(characterIds)

  return {
    actors,
    segment: 0,
  }
}

const updateFrame = (update: (frame: SceneFrame) => SceneFrame) => (frame: SceneFrame) => {
  return update(frame)
}

const updateCurrentFrame = (update: (frame: SceneFrame) => SceneFrame) => (state: SceneStateContainer) => ({
  ...state,
  scene: state.scene === undefined ? undefined : {
    ...state.scene,
    frames: concat(
      initial(state.scene.frames),
      map(updateFrame(update))(takeRight(1)(state.scene.frames))
    ),
  },
})

const updateActorInCurrentFrame = (actorId: ActorId, update: (actor: Actor) => Actor) => (state: SceneStateContainer) => {
  return updateCurrentFrame(
    (frame: SceneFrame) => ({
      ...frame,
      actors: {
        ...frame.actors,
        [actorId]: update(frame.actors[actorId]),
      },
    })
  )(state)
}

export const reduceSceneState = (state: SceneStateContainer, action: SceneAction | CommonAction): SceneState | undefined => {
  switch (action.type) {
    case getType(CommonActions.initialized):
      return undefined

    case getType(SceneActions.sceneStarted):
      const initialFrame = createInitialFrame(action.payload.characters, state)
      return {
        characters: action.payload.characters,
        frames: [initialFrame],
      }

    case getType(SceneActions.positionChanged):
      return updateActorInCurrentFrame(
        action.payload.actorId,
        (actor: Actor): Actor => ({ ...actor, position: { x: action.payload.x, y: action.payload.y } })
      )(state).scene

    case getType(SceneActions.intentionDeclared):
      return updateActorInCurrentFrame(
        action.payload.actorId,
        (actor: Actor): Actor => ({ ...actor, intention: action.payload.intention })
      )(state).scene

      // case getType(Actions.timeAdvanced):
      //   return flow(
      //     (state: GemstoneState) => handleIntentions(state, action.payload.segments),
      //     (state: GemstoneState): GemstoneState => ({
      //       ...state,
      //       scene: state.scene === undefined ? undefined : {
      //         ...state.scene,
      //         currentSegment: (state.scene?.currentSegment ?? 0) + action.payload.segments,
      //       },
      //     })
      //   )(state)

      // case getType(Actions.timeChanged):
      //   return {
      //       ...state,
      //       scene: state.scene === undefined ? undefined : {
      //         ...state.scene,
      //         currentSegment: action.payload.segment,
      //       },
      //     }

    default:
      return state.scene
  }
}
