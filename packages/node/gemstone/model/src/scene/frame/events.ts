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
    action: ActionType
  }>(),

  /** the current frame has been identified as a key frame */
  keyFrameMarked: createAction('frame/key-frame-marked')(),

  /** actor has moved to a specified position */
  moved: createAction('frame/actor-moved')<{ characterId: CharacterId; position: Point }>(),

  movementModeChanged: createAction('frame/actor-changed-movement-mode')<{
    characterId: CharacterId
    mode: MovementModeId
  }>(),

  /** frame's time offset has been changed */
  timeOffsetChanged: createAction('frame/time-offset-changed')<number>(),
}

export type FrameEvent = EventType<typeof FrameEvents>