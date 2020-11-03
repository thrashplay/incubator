import { flow } from 'lodash'
import { get, identity, noop } from 'lodash/fp'

import { Character, CharacterState } from '../character'
import { addItem, BuilderFunction, createBuilder, toId } from '../common/builder'

const DEFAULT_SPEED = 90

/**
 * At least one of name or id is required to create a character. If only one is given, we use it to derive the other.
 */
type NotFunction = { apply?: never }
type RequiredCharacterFields = NotFunction &
(Pick<Character, 'id'> |
Pick<Character, 'name'> |
Pick<Character, 'id' | 'name'>)

// builders
export const build = createBuilder((initialValues: RequiredCharacterFields): Character => ({
  id: get('id')(initialValues) ?? toId(name),
  name: get('name')(initialValues) ?? get('id')(initialValues),
  speed: DEFAULT_SPEED,
}))

export const newCharacterState = (): CharacterState => ({
  pcs: {},
})

export const buildCharacterState = (
  ...operations: BuilderFunction<CharacterState>[]
): CharacterState => flow(...operations)(newCharacterState())

// field-specific operations
export const set = (values: Partial<Character>) => (character: Character) => ({ ...character, ...values })

// TODO: after creating this, the value was questionable... commented out for now but might delete later
// export const setId = (id: string) => (character: Character) => ({ ...character, id })
// export const setName = (name: string) => (character: Character) => ({ ...character, name })
// export const setReach = (reach?: number) => (character: Character) => ({ ...character, reach })
// export const setSize = (size?: number) => (character: Character) => ({ ...character, size })
// export const setSpeed = (speed: number) => (character: Character) => ({ ...character, speed })

// character state
export const addPc = (pc: Character) => (state: CharacterState) => ({ ...state, pcs: addItem(state.pcs, pc) })
