import { follow } from './follow'
import { meleeAttack } from './melee-attack'
import { move } from './move'
import { wait } from './wait'

/** set of known intention handles */
export const IntentionHandlers = {
  follow,
  idle: wait,
  melee: meleeAttack,
  move,
  wait,
}
