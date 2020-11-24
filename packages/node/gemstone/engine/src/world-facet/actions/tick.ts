import { getType } from 'typesafe-actions'

import { ActionHandler, AnyAction, EMPTY_ACTION_RESULT } from '@thrashplay/gemstone-engine'

import { WorldTransformations } from '../transformations/creators'

import { WorldActions } from './creators'

type TickAction = ReturnType<typeof WorldActions['tick']>

/** The default timeElapsed handler supports 'timeElapsed' actions, but does nothing with them. */
export const tickHandler: ActionHandler<TickAction> = {
  handle: (action: AnyAction) => ({
    ...EMPTY_ACTION_RESULT,
    transformations: [WorldTransformations.advanceTime(action.target, 1)],
  }),
  supports: (action: AnyAction): action is TickAction => action.type === getType(WorldActions.tick),
} as const
