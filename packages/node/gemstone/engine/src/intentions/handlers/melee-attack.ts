import { ActorStatus, CharacterId } from '@thrashplay/gemstone-model'

import { GameState } from '../../state'
import { getRangeCalculations } from '../selectors'
import { SimulationContext } from '../types'

import { moveTowardsDestination } from './move'

export interface Attack {
  target: CharacterId
}

/** handles the outcome of a melee attack intention */
export const meleeAttack = (actor: ActorStatus, { state }: SimulationContext<GameState>, attack: Attack) => {
  const { isInRange, targetPosition } = getRangeCalculations(state, {
    characterId: actor.id,
    targetId: attack.target,
  })

  return isInRange
    ? [] // attack actions go here
    : moveTowardsDestination(actor, targetPosition ?? actor.position, state)
}
