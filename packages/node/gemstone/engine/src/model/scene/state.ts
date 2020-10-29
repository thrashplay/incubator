import { Frame } from '../../simulation/state'
import { CharacterId, CharacterStateContainer } from '../character/state'
import { RulesStateContainer } from '../rules/state'

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
