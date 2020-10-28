import { CharacterState } from './character/state'
import { RulesState } from './rules/state'
import { SceneState } from './scene/state'

export interface GameState {
  characters: CharacterState
  rules: RulesState
  scene: SceneState
}
