import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../character'
import { Point } from '../types'

import { Frame, IntentionState } from './state'

export const SceneActions = {
  /** character added to the scene */
  characterAdded: createAction('scene/character-added')<CharacterId>(),

  /** new frame added to history */
  frameAdded: createAction('scene/frame-added')<Frame>(),

  /** current frame has been reloaded from a point in history */
  frameReverted: createAction('scene/current-frame-reverted')<number>(),

  /** actor has set an intention */
  intentionDeclared: createAction('scene/actor-declared-intention')<{
    characterId: CharacterId
    intention: IntentionState
  }>(),

  /** actor has moved to a specified position */
  moved: createAction('scene/actor-moved')<{ characterId: CharacterId; position: Point }>(),

  /** new scene has been started */
  sceneStarted: createAction('scene/started')(),
}

export type SceneAction = ActionType<typeof SceneActions>
