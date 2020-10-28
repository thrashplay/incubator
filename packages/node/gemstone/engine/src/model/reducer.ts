import { Action } from './action'
import { reduceCharacterState } from './character'
import { reduceRulesState } from './rules'
import { reduceSceneState } from './scene'
import { GameState } from './state'

export const reducer = (state: GameState, action: Action): GameState => {
  // cast to any, because reducers should ignore invalid input and I am lazy
  const result = {
    characters: reduceCharacterState(state.characters, action as any),
    rules: reduceRulesState(state.rules, action as any),
    scene: reduceSceneState(state.scene, action as any),
  }

  console.log('action:', action, 'result:', result)

  return result
}
