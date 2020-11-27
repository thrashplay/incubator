import { LogEntry } from '../log'
import { applyTransformation, Transformation } from '../transformation'

import { WorldState } from './world-state'

/** A state change that will be applied to the world, reflecting the outcome of an action's execution. */
export interface StateChange {
  /** Applies the change to the given world state, returning the new state. */
  apply: (world: WorldState) => WorldState

  /** Retrieves the log entry acting as a record of what this change was. */
  getLogEntry: () => LogEntry
}

/**
 * Converts a Transformation into a StateChange by "baking in" the parameter into the apply function,
 * and generating an appropriate log entry.
 */
export const createStateChange = (transformation: Transformation<string, any>) => ({
  apply: applyTransformation(transformation),
  getLogEntry: () => 'Log entries for state changes have not been implemented yet.',
})
