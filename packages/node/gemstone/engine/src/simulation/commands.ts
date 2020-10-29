import { map } from 'lodash/fp'

import {
  Character,
  CharacterId,
  getPlayerCharacters,
  Point,
  SceneActions,
  SceneStateContainer,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { createIntention } from '../intentions'

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

/** the actor's position has been moved to the specified location */
export const move = (characterId: CharacterId, position: Point) => () => {
  return SimulationActions.moved({
    characterId,
    position,
  })
}

export * from './calculate-frames'
export * from './calculate-next-frame'
