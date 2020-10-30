import { map } from 'lodash/fp'

import {
  Character,
  getPlayerCharacters,
  SceneActions,
  SceneStateContainer,
} from '@thrashplay/gemstone-model'

/** starts a new scene that includes all the player characters by default */
export const startNewScene = () => (state: SceneStateContainer) => [
  SceneActions.sceneStarted(),
  ...map((character: Character) => SceneActions.characterAdded(character.id))(getPlayerCharacters(state)),
]
