import { map } from 'lodash/fp'

import {
  Character,
  CharacterId,
  getBaseSpeed,
  getCurrentPosition,
  getPlayerCharacters,
  isValidPoint,
  Point,
  SceneActions,
  SceneStateContainer,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { createIntention } from '../intentions'
import { GameState } from '../state'

import { getNextPositionOnApproach } from './movement'

/** starts a new scene that includes all the player characters by default */
export const startNewScene = () => (state: SceneStateContainer) => [
  SceneActions.sceneStarted(),
  ...map((character: Character) => SceneActions.characterAdded(character.id))(getPlayerCharacters(state)),
]

/** the actor intends to move to the specified location */
export const declareMoveIntention = (characterId: CharacterId, x: number, y: number) => () => {
  return SimulationActions.intentionDeclared({
    characterId,
    intention: createIntention('move', { x, y }),
  })
}

/** move the actor to the specified location */
export const moveTo = (characterId: CharacterId, position: Point) => () => {
  return SimulationActions.moved({
    characterId,
    position,
  })
}

/** move the actor as fast as possible towards destination, but keep the given minimum distance */
export const approachLocation = (
  characterId: CharacterId,
  destination: Point,
  minDistance: number
) => (state: GameState) => {
  const position = getCurrentPosition(state, { characterId })
  const speed = getBaseSpeed(state, { characterId })

  return !isValidPoint(position) || !isValidPoint(destination)
    ? []
    : [moveTo(characterId, getNextPositionOnApproach(position, destination, speed, minDistance))()]
}

/**
 * Move the actor with the given characterId as fast as possible towards the actor with the given
 * targetId, but keep the given minimum distance between them while approaching.
 **/
export const approachActor = (
  characterId: CharacterId,
  targetId: CharacterId,
  minDistance: number
) => (state: GameState) => {
  const targetPosition = getCurrentPosition(state, { characterId: targetId })
  return !isValidPoint(targetPosition)
    ? []
    : [approachLocation(characterId, targetPosition, minDistance)]
}

export * from './calculate-frames'
export * from './calculate-next-frame'
