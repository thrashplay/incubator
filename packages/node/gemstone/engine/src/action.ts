import { castArray, isFunction, reduce } from 'lodash/fp'
import { ActionType } from 'typesafe-actions'

import {
  CharacterActions,
  CommonActions,
  RulesActions,
  SceneActions,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { GameState } from './state'

export const NOOP = { type: 'noop' } as const

export const AllActions = {
  ...CharacterActions,
  ...CommonActions,
  ...RulesActions,
  ...SceneActions,
  ...SimulationActions,
  NOOP,
}

export type Action = ActionType<typeof AllActions>

export type Command = (state: GameState) => Action | Command | (Action | Command)[]
export type Dispatch = (actions: Action) => void

/**
 * Executes a command, which returns an array of Actions or other Commands.
 * The results are processed by dispatching Actions, and recursively executing other commands. Each time a command
 * is executed, it will be supplied with the most up-to-date GameState (based on previously dispatched actions).
 */
export const createExecutor = (
  reducer: (state: GameState, action: Action) => GameState,
  state: GameState
) => (command: Command) => {
  const handleResult = (state: GameState, commandResult: Action | Command): GameState => {
    if (isFunction(commandResult)) {
      return createExecutor(reducer, state)(commandResult)
    } else {
      return reducer(state, commandResult)
    }
  }

  const commandResults = command(state)
  return reduce(handleResult)(state)(castArray(commandResults))
}
