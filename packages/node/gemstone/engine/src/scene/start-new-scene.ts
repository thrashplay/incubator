import { map } from 'lodash/fp'

import {
  Character,
  getPlayerCharacters,
  SceneEvents,
  SceneStateContainer,
} from '@thrashplay/gemstone-model'

/** starts a new scene that includes all the player characters by default */
export const startNewScene = () => (state: SceneStateContainer) => [
  SceneEvents.sceneStarted(),
  ...map((character: Character) => SceneEvents.characterAdded(character.id))(getPlayerCharacters(state)),
]
