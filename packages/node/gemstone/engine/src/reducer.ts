import { reduceCharacterState, reduceRulesState, reduceSceneState } from '@thrashplay/gemstone-model'

import { Event } from './events'
import { GameState } from './state'

export const reducer = (state: GameState, event: Event): GameState => {
  // cast to any, because reducers should ignore invalid input and I am lazy
  const result = {
    characters: reduceCharacterState(state.characters, event as any),
    rules: reduceRulesState(state.rules, event as any),
    scene: reduceSceneState(state.scene, event as any),
  }

  // eslint-disable-next-line no-console
  console.log('Event:', event, '; New State:', result)

  return result
}
