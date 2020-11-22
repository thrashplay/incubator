import { getType } from 'typesafe-actions'

import { ActionHandler, AnyAction, EMPTY_ACTION_RESULT } from '@thrashplay/gemstone-engine'

import { PeriodicActions } from './actions'

const { timeElapsed } = PeriodicActions

/** The default timeElapsed handler supports 'timeElapsed' actions, but does nothing with them. */
export const TimeElapsedHandler: ActionHandler<PeriodicActions> = {
  handle: () => EMPTY_ACTION_RESULT,
  supports: (action: AnyAction): action is PeriodicActions => action.type === getType(timeElapsed),
} as const
