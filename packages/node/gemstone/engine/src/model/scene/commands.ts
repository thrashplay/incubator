import { map } from 'lodash/fp'

import { SimulationActions } from '../../simulation'
import { createMoveIntention } from '../../simulation/intentions'
import { getPlayerCharacters } from '../character'
import { Character, CharacterId } from '../character/state'
import { Point } from '../types'

import { SceneActions } from './actions'
import { SceneStateContainer } from './state'

/** starts a new scene that includes all the player characters by default */
export const startNewScene = () => (state: SceneStateContainer) => [
  SceneActions.sceneStarted(),
  ...map((character: Character) => SceneActions.characterAdded(character.id))(getPlayerCharacters(state)),
]

/** the actor intends to move to the specified location */
export const declareMoveIntention = (characterId: CharacterId, x: number, y: number) => () => {
  return SimulationActions.intentionDeclared({
    characterId,
    intention: createMoveIntention(x, y),
  })
}

/** the actor's position has been moved to the specified location */
export const move = (characterId: CharacterId, position: Point) => () => {
  return SimulationActions.moved({
    characterId,
    position,
  })
}

export * from './commands/calculate-frames'
export * from './commands/calculate-next-frame'
