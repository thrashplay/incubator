import { map } from 'lodash/fp'

import { createIntention } from '../intentions'
import { Character, CharacterId, getPlayerCharacters } from '../model/character'
import { SimulationActions } from '../model/frame'
import { SceneActions } from '../model/scene/actions'
import { SceneStateContainer } from '../model/scene/state'
import { Point } from '../model/types'

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
