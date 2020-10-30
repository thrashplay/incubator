import { ActorStatus, CharacterId } from '@thrashplay/gemstone-model'

import { intercept } from '../../simulation'
import { GameState } from '../../state'
import { getRangeCalculations } from '../selectors'
import { SimulationContext } from '../types'

export interface Attack {
  target: CharacterId
}

/** handles the outcome of a melee attack intention */
export const meleeAttack = (actor: ActorStatus, { state }: SimulationContext<GameState>, attack: Attack) => {
  const { isInRange, range } = getRangeCalculations(state, {
    characterId: actor.id,
    targetId: attack.target,
  })

  return isInRange
    ? [] // attack actions go here
    : intercept(actor.id, attack.target, { minimumDistance: range })
}
