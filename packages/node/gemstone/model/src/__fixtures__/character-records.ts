import { buildCharacterRecords, CharacterRecordsBuilder } from '../character'

import { Characters } from './characters'

const { addCharacter } = CharacterRecordsBuilder
const { Gimli, Trogdor } = Characters

export const CharacterRecords = {
  Default: buildCharacterRecords(),
  Empty: buildCharacterRecords(),
  WithGimli: buildCharacterRecords(
    addCharacter(Gimli)
  ),
  WithTrogdor: buildCharacterRecords(
    addCharacter(Trogdor)
  ),
  WithGimliAndTrogdor: buildCharacterRecords(
    addCharacter(Gimli),
    addCharacter(Trogdor)
  ),
}
