import { Action } from '@thrashplay/gemstone-engine/src/action'
import { GameState } from '@thrashplay/gemstone-engine/src/state'
import { reduceCharacterState, reduceRulesState, reduceSceneState } from '@thrashplay/gemstone-model'

export const reducer = (state: GameState, action: Action): GameState => {
  // cast to any, because reducers should ignore invalid input and I am lazy
  const result = {
    characters: reduceCharacterState(state.characters, action as any),
    rules: reduceRulesState(state.rules, action as any),
    scene: reduceSceneState(state.scene, action as any),
  }

  console.log('Action:', action, '; New State:', result)

  return result
}
