import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../character'
import { Point } from '../types'

import { IntentionState } from './state'

export const SceneActions = {
  characterAdded: createAction('scene/character-added')<CharacterId>(),
  intentionDeclared: createAction('scene/actor-declared-intention')<{
    characterId: CharacterId
    intention: IntentionState
  }>(),
  moved: createAction('scene/actor-moved')<{ characterId: CharacterId; position: Point }>(),
  sceneStarted: createAction('scene/started')(),
}

export type SceneAction = ActionType<typeof SceneActions>
