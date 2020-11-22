import { attack } from '../handlers/attack'
import { follow } from '../handlers/follow'
import { move } from '../handlers/move'
import { wait } from '../handlers/wait'

/** set of known action handles */
export const ActionHandlers = {
  follow,
  idle: wait,
  attack,
  move,
  wait,
} as const
