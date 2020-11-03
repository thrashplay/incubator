import { flow, toLower } from 'lodash/fp'

import { toDictionary } from '@thrashplay/fp'

import { Character, CharacterState } from '../character'

export type BuilderFunction<TProduct extends unknown = any> = (input: TProduct) => TProduct

export const newCharacter = (name: string, id?: string) => (): Character => ({
  id: id ?? toLower(name),
  name,
  speed: 90,
})

export const setCharacterFields = (
  values: Partial<Character>
): BuilderFunction<Character> => (character: Character) => ({ ...character, ...values })

export const setReach = (
  reach?: number
): BuilderFunction<Character> => (character: Character) => ({ ...character, reach })

export const setSize = (
  size?: number
): BuilderFunction<Character> => (character: Character) => ({ ...character, size })

export const setSpeed = (
  speed: number
): BuilderFunction<Character> => (character: Character) => ({ ...character, speed })

export const newCharacterState = (...pcs: Character[]) => (): CharacterState => ({
  pcs: toDictionary('id')(pcs),
})

export const Gimli = flow(
  newCharacter('Gimli, son of Glóin', 'gimli'),
  setSpeed(60)
)()

export const Trogdor = flow(
  newCharacter('Trogdor, the Burninator', 'trogdor'),
  setSpeed(120)
)()
