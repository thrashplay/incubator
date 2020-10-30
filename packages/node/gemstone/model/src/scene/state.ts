import { CharacterId, CharacterStateContainer } from '../character'
import { RulesStateContainer } from '../rules'

import { Frame } from './frame'

export interface SceneState {
  /** IDs of the characters in this scene */
  characters: CharacterId[]

  /** the index of the current frame, representing the present moment */
  currentFrame: number

  /** array of frames comprising this scene */
  frames: Frame[]
}

type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
export type SceneStateContainer = ExternalRequiredState & {
  scene: SceneState
}
