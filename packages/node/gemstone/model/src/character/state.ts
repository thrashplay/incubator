export type CharacterId = string
export interface Character {
  id: CharacterId
  name: string

  /** the actor's base speed, in feet of movement per minute */
  speed: number
}

export interface CharacterState {
  pcs: Record<CharacterId, Character>
}

export interface CharacterStateContainer {
  characters: CharacterState
}
