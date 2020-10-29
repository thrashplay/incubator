import { CharacterState, RulesState, SceneState } from '@thrashplay/gemstone-model'

export interface GameState {
  characters: CharacterState
  rules: RulesState
  scene: SceneState
}
