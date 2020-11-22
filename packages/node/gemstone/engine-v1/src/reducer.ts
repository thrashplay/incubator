import { reduceMapState } from '@thrashplay/gemstone-map-model'
import {
  reduceCharacterState,
  reduceRandomTablesState,
  reduceRulesState,
  reduceSceneState,
} from '@thrashplay/gemstone-model'

import { Event } from './events'
import { GameState } from './state'

export const reducer = (state: GameState, event: Event): GameState => {
  // cast to any, because reducers should ignore invalid input and I am lazy
  const result = {
    characters: reduceCharacterState(state.characters, event as any),
    map: reduceMapState(state.map, event as any),
    rules: reduceRulesState(state.rules, event as any),
    scene: reduceSceneState(state.scene, event as any),
    tables: reduceRandomTablesState(state.tables, event as any),
  }

  // eslint-disable-next-line no-console
  // console.log('Event:', event, '; New State:', result)

  return result
}
