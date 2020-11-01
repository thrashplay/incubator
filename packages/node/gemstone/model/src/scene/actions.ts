import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../character'

import { Frame } from './frame/state'

export const SceneActions = {
  /** character added to the scene */
  characterAdded: createAction('scene/character-added')<CharacterId>(),

  /** new frame added to the timline */
  frameAdded: createAction('scene/frame-added')<Frame>(),

  /**
   * Commits the current frame by cloning it and appending the copy to the end of the list.
   * The new frame will have it's "key frame" status cleared, if it was set.
   **/
  frameCommitted: createAction('scene/frame-committed')(),

  /** set the specified tag to the given frame index */
  frameTagged: createAction('scene/frame-tagged')<{ frameNumber: number; tag: string }>(),

  /** remove the specified frame tag */
  frameTagDeleted: createAction('scene/frame-tag-deleted')<string>(),

  /** new scene has been started */
  sceneStarted: createAction('scene/started')(),

  /** all frames after the specified one are removed (the frame with the given index is kept) */
  truncated: createAction('scene/truncated')<number>(),
}

export type SceneAction = ActionType<typeof SceneActions>
