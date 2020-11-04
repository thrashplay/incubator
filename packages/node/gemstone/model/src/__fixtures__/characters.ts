import { buildCharacter, CharacterBuilder } from '../character'

const { set } = CharacterBuilder

export const Characters = {
  // slower than default
  Gimli: buildCharacter(
    { id: 'gimli', name: 'Gimli, son of Glóin' },
    set({ speed: 60 })
  ),

  // larger than default
  Treestump: buildCharacter(
    { id: 'treestump', name: 'Treestump Block' },
    set({ size: 5 })
  ),

  // faster than default
  Trogdor: buildCharacter(
    { id: 'trogdor', name: 'Trogdor, the Burninator' },
    set({ speed: 120 })
  ),
}
