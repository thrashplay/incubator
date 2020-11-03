import { CharacterBuilder } from '../character'

import { Characters } from './characters'

const { addPc, buildCharacterState, newCharacterState } = CharacterBuilder
const { Gimli, Trogdor } = Characters

export const CharacterStates = {
  Default: newCharacterState(),
  Empty: newCharacterState(),
  WithGimli: buildCharacterState(
    addPc(Gimli)
  ),
  WithTrogdor: buildCharacterState(
    addPc(Trogdor)
  ),
  WithGimliAndTrogdor: buildCharacterState(
    addPc(Gimli),
    addPc(Trogdor)
  ),
}
