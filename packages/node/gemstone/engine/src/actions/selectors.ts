import { createSelector } from 'reselect'

import {
  Actor,
  CharacterId,
  createParameterSelector,
  getActor,
  getActorCollection,
  getMeleeRange,
  getPosition,
  getPublicCharacterName,
  getState,
} from '@thrashplay/gemstone-model'

import { calculateDistance } from '../movement'

import { Action } from './types'

export interface SceneSelectorParameters {
  characterId?: CharacterId
  targetId?: CharacterId
}

export const getCharacterIdParam = createParameterSelector((params?: SceneSelectorParameters) => params?.characterId)
export const getTargetIdParam = createParameterSelector((params?: SceneSelectorParameters) => params?.targetId)

const getParameters = (_: any, parameters?: SceneSelectorParameters) => parameters

export const getTarget = createSelector(
  [getTargetIdParam, getActorCollection],
  (id, actors) => id === undefined ? undefined : actors[id]
)

export const getTargetPosition = createSelector(
  [getTarget],
  (target) => target?.status.position
)

export const getDistanceToTarget = createSelector(
  [getPosition, getTargetPosition],
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
  [getActor, getState, getParameters],
  (actor, state, parameters) => {
    const getWellKnownTypeString = (actor: Actor, action: Action) => {
      switch (action.type) {
        case 'follow':
          return `following ${getPublicCharacterName(state, { ...parameters, characterId: action.data })}`

        case 'melee': {
          const rangeCalculations = getRangeCalculations(state, {
            characterId: actor.id,
            targetId: action.data.target,
          })

          const targetName = getPublicCharacterName(state, { ...parameters, characterId: action.data.target })

          return rangeCalculations.isInRange
            ? `attacking ${targetName}`
            : `moving to attack ${targetName}`
        }

        case 'move': {
          const remainingDistance = calculateDistance(actor.status.position, action.data)
          const distance =
          remainingDistance < 20 ? 'a few feet'
            : remainingDistance < 150 ? 'a short distance'
              : remainingDistance < 240 ? 'a medium distance'
                : 'a long distance'
          return `moving ${distance}`
        }

        default:
          return action.type
      }
    }

    const action = actor?.status.action
    return action === undefined || actor === undefined
      ? 'being mysterious' // should never happen
      : getWellKnownTypeString(actor, action as Action)
  }
)
