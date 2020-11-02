import { createAction, ActionType as EventType } from 'typesafe-actions'

import { CharacterId } from '../../character'
import { Point } from '../../common'
import { MovementModeId } from '../../rules'

import { ActionType } from './state'

export const FrameEvents = {
  /** character added to the simulation */
  actorAdded: createAction('frame/actor-added')<CharacterId>(),

  /** actor has set an action */
  actionDeclared: createAction('frame/actor-declared-action')<{
    characterId: CharacterId
    action: ActionType<string, unknown>
  }>(),

  /** the current frame has been identified as a key frame */
  keyFrameMarked: createAction('frame/key-frame-marked')(),

  /** actor has moved to a specified position */
  moved: createAction('frame/actor-moved')<{ characterId: CharacterId; position: Point }>(),

  movementModeChanged: createAction('frame/actor-changed-movement-mode')<{
    characterId: CharacterId
    mode: MovementModeId
  }>(),

  /** the actor has declared a new target */
  targetChanged: createAction('frame/actor-changed-target')<{ characterId: CharacterId; targetId: CharacterId }>(),

  /** the target has removed it's target */
  targetRemoved: createAction('frame/actor-removed-target')<CharacterId>(),

  /** frame's time offset has been changed */
  timeOffsetChanged: createAction('frame/time-offset-changed')<number>(),
}

export type FrameEvent = EventType<typeof FrameEvents>
