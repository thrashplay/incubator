import {
  SceneActions,
} from '@thrashplay/gemstone-model'

import { GameState } from '../state'

import { run } from './run'

export const calculateNextFrame = () => (_: GameState) => {
  return [
    SceneActions.frameCommitted(),
    run(),
  ]
}
