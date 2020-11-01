import { follow } from '../handlers/follow'
import { meleeAttack } from '../handlers/melee-attack'
import { move } from '../handlers/move'
import { wait } from '../handlers/wait'

/** set of known action handles */
export const ActionHandlers = {
  follow,
  idle: wait,
  melee: meleeAttack,
  move,
  wait,
}
