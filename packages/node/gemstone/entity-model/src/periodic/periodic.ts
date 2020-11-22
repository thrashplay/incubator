import { extend, Facet } from '@thrashplay/gemstone-engine'

import { TimeElapsedHandler } from './time-elapsed-handler'

/** Facet providing basic support for responding to the passage of time. */
export const Periodic: Facet = {
  id: 'periodic',
  defaultActionHandlers: [TimeElapsedHandler],
} as const

/** Extends an entity with the Periodic facet. */
export const makePeriodic = extend(Periodic)
