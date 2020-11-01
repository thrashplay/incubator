
import { ActorStatus, CharacterId } from '@thrashplay/gemstone-model'

import { GameState } from '../..//state'
import { MovementCommands } from '../../movement'
import { getRangeCalculations } from '../selectors'
import { SimulationContext } from '../types'

export interface Attack {
  target: CharacterId
}

/** handles the outcome of a melee attack action */
export const meleeAttack = (actor: ActorStatus, { state }: SimulationContext<GameState>, attack: Attack) => {
  const { isInRange, range } = getRangeCalculations(state, {
    characterId: actor.id,
    targetId: attack.target,
  })

  return isInRange
    ? [] // attack actions go here
    : MovementCommands.intercept(actor.id, attack.target, { minimumDistance: range })
}
