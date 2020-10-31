import { Action } from './action'
import { GameState } from './state'
import { Command } from './store'

const NoOp = [] as ReturnType<Command<GameState, Action>>

export const error = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.error(...args)
  return NoOp
}
