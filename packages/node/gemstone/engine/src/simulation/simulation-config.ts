import { Facet } from '../facet'
import { LogEntry } from '../log'
import { WorldState } from '../world-state'

import { ActionExecutor, createActionExecutor } from './action-executor'
import { createActionResponderFactory } from './action-responder-factory'

/** Configuration metadata and dependencies used to bootstrap a new simulation. */
export interface SimulationConfig {
  /** Executor used to process actions, and calculate the necessary world StateChanges. */
  actionExecutor: ActionExecutor

  /** World state to initialize the simulation to, or the default state if none. */
  initialWorldState?: WorldState

  /** Callback used to append simulation events to the game log. */
  log: (logEntry: LogEntry) => void
}

/** Creates a new SimulationConfig for a simulation that will support the supplied set of Facets. */
export const createSimulationConfig = (facets = [] as Facet[], initialWorldState?: WorldState): SimulationConfig => ({
  actionExecutor: createActionExecutor(createActionResponderFactory(facets)),
  initialWorldState,
  // eslint-disable-next-line no-console
  log: (logEntry) => console.log(logEntry),
})
