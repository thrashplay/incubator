import { createSelector } from 'reselect'

import { calculateDistance, Intention } from '@thrashplay/gemstone-engine'
import {
  Actor,
  CharacterId,
  createParameterSelector,
  getActor,
  getActorCollection,
  getCurrentPosition,
  getMeleeRange,
  getPublicCharacterName,
  getState,
} from '@thrashplay/gemstone-model'

import { meleeAttack } from './handlers/melee-attack'

export interface SceneSelectorParameters {
  characterId?: CharacterId
  targetId?: CharacterId
}

export const getCharacterIdParam = createParameterSelector((params: SceneSelectorParameters) => params.characterId)
export const getTargetIdParam = createParameterSelector((params: SceneSelectorParameters) => params.targetId)

export const getTarget = createSelector(
  [getTargetIdParam, getActorCollection],
  (id, actors) => id === undefined ? undefined : actors[id]
)

export const getTargetPosition = createSelector(
  [getTarget],
  (target) => target?.status.position
)

export const getDistanceToTarget = createSelector(
  [getCurrentPosition, getTargetPosition],
  (position, targetPosition) => position === undefined || targetPosition === undefined
    ? Number.MAX_SAFE_INTEGER
    : calculateDistance(position, targetPosition)
)

export const isInRange = createSelector(
  [getDistanceToTarget, getMeleeRange],
  (distance, meleeRange) => distance <= meleeRange
)

export const getRangeCalculations = createSelector(
  [getTargetPosition, getMeleeRange, getDistanceToTarget, isInRange],
  (targetPosition, range, distance, isInRange) => ({
    distance,
    isInRange,
    range,
    targetPosition,
  })
)

/** Returns a human-readable description of the actor's current action */
export const getPublicActionDescription = createSelector(
  [getActor, getState],
  (actor, state) => {
    const getWellKnownTypeString = (actor: Actor, intention: Intention) => {
      switch (intention.type) {
        case 'follow':
          return `following ${getPublicCharacterName(state, { characterId: intention.data })}`

        case 'melee': {
          const rangeCalculations = getRangeCalculations(state, {
            characterId: actor.id,
            targetId: intention.data.target,
          })

          const targetName = getPublicCharacterName(state, { characterId: intention.data.target })

          return rangeCalculations.isInRange
            ? `attacking ${targetName}`
            : `moving to attack ${targetName}`
        }

        case 'move': {
          const remainingDistance = calculateDistance(actor.status.position, intention.data)
          const distance =
          remainingDistance < 20 ? 'a few feet'
            : remainingDistance < 150 ? 'a short distance'
              : remainingDistance < 240 ? 'a medium distance'
                : 'a long distance'
          return `moving ${distance}`
        }

        default:
          return intention.type
      }
    }

    const intention = actor?.status.intention
    return intention === undefined || actor === undefined
      ? 'being mysterious' // should never happen
      : getWellKnownTypeString(actor, intention as Intention)
  }
)
