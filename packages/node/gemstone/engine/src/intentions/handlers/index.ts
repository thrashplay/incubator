import { move } from './move'
import { wait } from './wait'

/** set of known intention handles */
export const IntentionHandlers = {
  idle: wait,
  move,
  wait,
}
