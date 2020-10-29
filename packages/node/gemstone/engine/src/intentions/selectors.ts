import { createSelector } from 'reselect'

import { calculateDistance, Intention } from '@thrashplay/gemstone-engine'
import { Actor, getActor, getPublicCharacterName, getState } from '@thrashplay/gemstone-model'

/** Returns a human-readable description of the actor's current action */
export const getPublicActionDescription = createSelector(
  [getActor, getState],
  (actor, state) => {
    const getWellKnownTypeString = (actor: Actor, intention: Intention) => {
      switch (intention.type) {
        case 'follow':
          return `following ${getPublicCharacterName(state, { characterId: intention.data })}`

        case 'move': {
          const remainingDistance = calculateDistance(actor.status.position, intention.data)
          const distance =
          remainingDistance < 20 ? 'a few feet'
            : remainingDistance < 240 ? `about ${Math.round(remainingDistance / 15) * 15} feet`
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
