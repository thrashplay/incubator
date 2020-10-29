import { ActionType, createAction } from 'typesafe-actions'

import { Frame } from '../../simulation/state'
import { CharacterId } from '../character'

export const SceneActions = {
  /** character added to the scene */
  characterAdded: createAction('scene/character-added')<CharacterId>(),

  /** new frame added to history */
  frameAdded: createAction('scene/frame-added')<Frame>(),

  /** current frame has been reloaded from a point in history */
  frameReverted: createAction('scene/current-frame-reverted')<number>(),

  /** new scene has been started */
  sceneStarted: createAction('scene/started')(),
}

export type SceneAction = ActionType<typeof SceneActions>
