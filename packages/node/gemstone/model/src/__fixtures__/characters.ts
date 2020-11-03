import { CharacterBuilder } from '../character'

const { build, set } = CharacterBuilder

export const Characters = {
  Gimli: build(
    { id: 'gimli', name: 'Gimli, son of Glóin' },
    set({ speed: 60 })
  ),
  Trogdor: build(
    { id: 'trogdor', name: 'Trogdor, the Burninator' },
    set({ speed: 120 })
  ),
}
