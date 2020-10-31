import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../character'

export const SceneActions = {
  /** character added to the scene */
  characterAdded: createAction('scene/character-added')<CharacterId>(),

  /** current frame has been set to a new value */
  currentFrameChanged: createAction('scene/current-frame-changed')<number>(),

  /** commits the current frame by cloning it and appending the copy to the end of the list */
  frameCommitted: createAction('scene/frame-committed')(),

  /** new scene has been started */
  sceneStarted: createAction('scene/started')(),

  /** all frames after the specified one are removed (the frame with the given index is kept) */
  truncated: createAction('scene/truncated')<number>(),
}

export type SceneAction = ActionType<typeof SceneActions>
