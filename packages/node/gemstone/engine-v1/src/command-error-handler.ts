import { Event } from './events'
import { GameState } from './state'
import { Command } from './store'

const NoOp = [] as ReturnType<Command<GameState, Event>>

export const error = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.error(...args)
  return NoOp
}
