import { Dictionary } from '../common'

export type CharacterId = string
export interface Character {
  id: CharacterId
  name: string

  /** the actor's base reach, in feet; defaults to the rule system's default melee range */
  reach?: number

  /**
   * The actor's base size, which is the radius of the circle they occupy (other base shapes to come later).
   * Currently defaults to 3 feet.
   **/
  size: number

  /** the actor's base speed, in feet of movement per minute */
  speed: number
}

export type CharacterRecordSet = Dictionary<CharacterId, Character>

export interface CharacterStateContainer extends Dictionary<string, unknown> {
  characters: CharacterRecordSet
}
