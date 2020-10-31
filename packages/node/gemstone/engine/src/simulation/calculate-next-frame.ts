import {
  SceneActions,
} from '@thrashplay/gemstone-model'

import { GameState } from '../state'

import { runSimulation } from './run-simulation'

export const calculateNextFrame = () => (_: GameState) => {
  return [
    SceneActions.frameCommitted(),
    runSimulation(),
  ]
}
