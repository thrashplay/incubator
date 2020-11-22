import { flow } from 'lodash'
import { forEach, get, map } from 'lodash/fp'

import { Action } from '../action'
import { buildEntity } from '../entity'
import { LogEntry } from '../log'
import { buildWorldState, StateChange, WORLD_ID, WorldState, WorldStateBuilders } from '../world-state'

import { SimulationConfig } from './simulation-config'

const { addEntity } = WorldStateBuilders

/** Simulation that manages the world state and action pipeline. */
export interface Simulation {
  /** Dispatches a Game Action, allowing entities to exert influence over each other. */
  dispatch: (action: Action) => void

  /**
   * Retrieves the current WorldState.
   * The returned value is immutable, and should not be cached because it will not reflect future updates.
   **/
  getWorld: () => WorldState
}

/** Creates a Simulation matching the specified configuration. */
export const createSimulation = ({
  actionExecutor,
  log,
}: SimulationConfig): Simulation => {
  let world: WorldState = buildWorldState(
    addEntity(buildEntity({ id: WORLD_ID }))
  )

  /**
   * If an action dispatch fails, adds the explanation message to the game log.
   * The preserved current world state is returned.
   **/
  const logDispatchError = (logEntry: LogEntry) => {
    log(logEntry)
    return world
  }

  /**
   * After dispatching an action, applying the resulting state changes to the world and return the new world state. *
   */
  const applyStateChanges = (stateChanges: StateChange[]) => {
    forEach((stateChange: StateChange) => {
      log(stateChange.getLogEntry())
    })(stateChanges)

    return flow(
      ...(map(get('apply'))(stateChanges))
    )(world)
  }

  return {
    dispatch: (action: Action) => {
      // after initialization, this is the only place the world gets updated
      world = actionExecutor(action, world).cata(logDispatchError, applyStateChanges)
    },
    getWorld: () => world,
  }
}
