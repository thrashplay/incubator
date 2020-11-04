import { Dictionary } from 'lodash'

import { CharacterId, CharacterStateContainer } from '../character'
import { MonsterTypeId } from '../monster'
import { RulesStateContainer } from '../rules'

import { EMPTY_FRAME, Frame } from './frame'

export const SINGLE_EMPTY_FRAME: [Frame, ...Frame[]] = [EMPTY_FRAME]
export const EMPTY_SCENE: Scene = {
  actors: {},
  frames: SINGLE_EMPTY_FRAME,
  frameTags: {},
}

export type ActorType = 'pc' | 'monster'
export type ActorStatReference = {
  id: CharacterId
  type: 'pc'
} | {
  id: MonsterTypeId
  type: 'monster'
}

export interface Scene {
  actors: Dictionary<ActorStatReference>

  /** array of frames comprising this scene, of which there is always at least one */
  frames: [Frame, ...Frame[]]

  /**
   * Set of frame 'tags', which are names assigned to particular frame numbers.
   * This allows components to query frames by a well-known context, without passing around specific
   * frame numbers.
   */
  frameTags: { [k in string]?: number }
}

type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
export type SceneStateContainer = ExternalRequiredState & {
  scene: Scene
}
