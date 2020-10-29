import { CharacterId, CharacterStateContainer } from '../character'
import { Frame } from '../frame'
import { RulesStateContainer } from '../rules'

export interface SceneState {
  /** IDs of the characters in this scene */
  characters: CharacterId[]

  /** array of frames comprising this scene */
  frames: Frame[]
}

type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
export type SceneStateContainer = ExternalRequiredState & {
  scene: SceneState
}
