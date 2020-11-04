import { get } from 'lodash/fp'

import { addItem, createBuilder, removeItem } from '@thrashplay/fp'

import { Character } from '../character'
import { AtLeastOneOfIdOrName } from '../common'

import { CharacterRecordSet } from './state'

const DEFAULT_SIZE = 3
const DEFAULT_SPEED = 90

/**
 * Builder function for Character instances
 * At least one of name or id is required to create a character. If only one is given, we use it to derive the other.
 */
export const buildCharacter = createBuilder((initialValues: AtLeastOneOfIdOrName): Character => ({
  id: get('id')(initialValues) ?? get('name')(initialValues),
  name: get('name')(initialValues) ?? get('id')(initialValues),
  size: DEFAULT_SIZE,
  speed: DEFAULT_SPEED,
}))

/** builder function for CharacterRecords instances */
export const buildCharacterRecords = createBuilder((): CharacterRecordSet => ({ }))

// Character: field-specific operations
const set = (values: Partial<Character>) => (initial: Character) => ({ ...initial, ...values })

// CharacterRecords: field-specific operations
const addCharacter = (pc: Character) => (records: CharacterRecordSet) => addItem(records, pc)
const removeCharacter = (id: Character['id']) => (records: CharacterRecordSet) => removeItem(records, id)

export const CharacterBuilder = {
  set,
}

export const CharacterRecordsBuilder = {
  addCharacter,
  removeCharacter,
}

// TODO: after creating this, the value was questionable... commented out for now but might delete later
// export const setId = (id: string) => (character: Character) => ({ ...character, id })
// export const setName = (name: string) => (character: Character) => ({ ...character, name })
// export const setReach = (reach?: number) => (character: Character) => ({ ...character, reach })
// export const setSize = (size?: number) => (character: Character) => ({ ...character, size })
// export const setSpeed = (speed: number) => (character: Character) => ({ ...character, speed })
