import { Character, CharacterId, CharacterStateContainer } from '../character/state'
import { RulesStateContainer } from '../rules/state'
import { Point } from '../types'

export interface BaseIntention<TType extends string = string> {
  type: TType
}

export type IntentionState<
  TType extends string = string,
  TData extends unknown = never
> = ([TData] extends [never] ? unknown : {
  data: TData
}) & BaseIntention<TType>

export type Idle = IntentionState<'idle'>

/** scene-specific status for the actor */
export interface ActorStatus {
  id: CharacterId

  /** the actor's current intention (that is, selected game action) */
  intention: IntentionState

  /** the current position of the actor, in world coordinates */
  position: Point
}

/** combined data structure, merging full character info with the associated scene status */
export type Actor = Character & {
  status: ActorStatus
}

/** a single frame, containing the status of all actors at a single point in a time */
export interface Frame {
  actors: Record<CharacterId, ActorStatus>
}

export interface SceneState {
  /** IDs of the characters in this scene */
  characters: CharacterId[]

  /** the frame number corresponding to the first entry in the frames array */
  frameOffset: number

  /** array of frames comprising this scene */
  frames: Frame[]
}

type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
export type SceneStateContainer = ExternalRequiredState & {
  scene: SceneState
}
