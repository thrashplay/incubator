import { Point } from 'gemstone/model/src/common/types'

import { Character, CharacterId, CharacterStateContainer } from '../character'
import { RulesStateContainer } from '../rules'

export const EMPTY_FRAME: Frame = {
  actors: {},
  timeOffset: 0,
}

export interface IntentionType<TType extends string = string, TData extends any = any> {
  type: TType
  data?: TData
}

/** scene-specific status for the actor */
export interface ActorStatus {
  id: CharacterId

  /** the actor's current intention (that is, selected game action) */
  intention: IntentionType

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

  /** the time offset, in seconds, of this frame */
  timeOffset: number
}

export interface SimulationState {
  currentFrame: Frame
}

export type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
