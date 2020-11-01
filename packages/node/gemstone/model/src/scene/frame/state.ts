import { Point } from 'gemstone/model/src/common/types'

import { Character, CharacterId, CharacterStateContainer } from '../../character'
import { MovementModeId, RulesStateContainer } from '../../rules'

export const EMPTY_FRAME: Frame = {
  actors: {},
  keyFrame: false,
  timeOffset: 0,
}

export interface ActionType<TType extends string = string, TData extends any = any> {
  type: TType
  data?: TData
}

/** scene-specific status for the actor */
export interface ActorStatus {
  id: CharacterId

  /** the actor's current action (that is, selected game action) */
  action: ActionType

  /** the type of movement currently used by this actor, or the rule system default if undefined */
  movementMode?: MovementModeId

  /** the current position of the actor, in world coordinates */
  position: Point

  /** the actor's current target */
  target?: CharacterId
}

/** combined data structure, merging full character info with the associated scene status */
export type Actor = Character & {
  status: ActorStatus
}

/** a single frame, containing the status of all actors at a single point in a time */
export interface Frame {
  actors: Record<CharacterId, ActorStatus>

  /** if true, this frame is a 'key frame', meaning there is a reason to stop the simulation when it is reached */
  keyFrame?: boolean

  /** the time offset, in seconds, of this frame */
  timeOffset: number
}

export interface SimulationState {
  currentFrame: Frame
}

export type ExternalRequiredState = RulesStateContainer & CharacterStateContainer
