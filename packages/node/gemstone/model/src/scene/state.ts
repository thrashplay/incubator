import { CharacterId, CharacterStateContainer } from '../character'
import { MonsterTypeId } from '../monster'
import { RulesStateContainer } from '../rules'
import { Dictionary } from '../types'

import { EMPTY_FRAME, Frame } from './frame'

export const EMPTY_SCENE: SceneState = {
  actors: {},
  frames: [EMPTY_FRAME],
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

export interface SceneState {
  actors: Dictionary<ActorStatReference, MonsterTypeId | CharacterId>

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
