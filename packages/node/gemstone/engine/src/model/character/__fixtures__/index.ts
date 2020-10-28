import { reduce } from 'lodash/fp'

import { Character } from '../state'

export const CharacterFixtures = {
  Trogdor: {
    id: 'trogdor',
    name: 'Trogdor, the Burninator',
    speed: 120,
  },
  Gimli: {
    id: 'gimli',
    name: 'Gimli, son of Glóin',
    speed: 60,
  },
}

export const CharacterStateFixtures = {
  Default: {
    pcs: {},
  },
  WithTrogdor: {
    pcs: {
      trogdor: CharacterFixtures.Trogdor,
    },
  },
}

export const stateWithCharacters = (...characters: Character[]) => {
  const reducer = (result: Record<string, Character>, character: Character) => ({
    ...result,
    [character.id]: character,
  })

  return {
    ...CharacterStateFixtures.Default,
    pcs: reduce(reducer)({})(characters),
  }
}
