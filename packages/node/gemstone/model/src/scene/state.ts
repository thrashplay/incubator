import { CharacterId, CharacterStateContainer } from '../character'
import { RulesStateContainer } from '../rules'

import { EMPTY_FRAME, Frame } from './frame'

export const EMPTY_SCENE: SceneState = {
  characters: [],
  frames: [EMPTY_FRAME],
  frameTags: {},
}

export interface SceneState {
  /** IDs of the characters in this scene */
  characters: CharacterId[]

  /** array of frames comprising this scene */
  frames: Frame[]

  /**
   * Set of frame 'tags', which are names assigned to particular frame numbers.
   * This allows components to query frames by a well-known context, without passing around specific
   * frame numbers.
   */
  frameTags: { [k in string]?: number }
}

type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
export type SceneStateContainer = ExternalRequiredState & {
  scene: SceneState
}
