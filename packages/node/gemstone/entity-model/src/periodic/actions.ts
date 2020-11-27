import { ActionType } from 'typesafe-actions'

import { createAction } from '@thrashplay/gemstone-engine'

export const PeriodicActions = {
  /** Action sent to periodic entities to notify them as game time elapses. */
  timeElapsed: createAction('time-elapsed')<{ currentTime: number }>(),
}

export type PeriodicActions = ActionType<typeof PeriodicActions>
