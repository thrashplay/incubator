import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../../character'
import { Point } from '../../common'

import { IntentionType } from './state'

export const FrameActions = {
  /** character added to the simulation */
  actorAdded: createAction('frame/actor-added')<CharacterId>(),

  /** actor has set an intention */
  intentionDeclared: createAction('frame/actor-declared-intention')<{
    characterId: CharacterId
    intention: IntentionType
  }>(),

  /** the current frame has been identified as a key frame */
  keyFrameMarked: createAction('frame/key-frame-marked')(),

  /** actor has moved to a specified position */
  moved: createAction('frame/actor-moved')<{ characterId: CharacterId; position: Point }>(),

  /** frame's time offset has been changed */
  timeOffsetChanged: createAction('frame/time-offset-changed')<number>(),
}

export type FrameAction = ActionType<typeof FrameActions>
