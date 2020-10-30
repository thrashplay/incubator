import { castArray, isFunction, reduce } from 'lodash/fp'

// TODO: this ended up being custom redux-light... maybe just use Redux?

/**
 * A request to achieve an effect represented by one or more actions and/or other commands
 * This is a function that takes the current state when the command is initiated, and should return
 * a collection of actions and commands to achieve the resulting state.
 *
 * Commands are requests to change state, and as such do not provide a guaranteed outcome -- they
 * may return actions that create error information in the state on failure, etc.
 *
 * TODO: change this representation so that commands are serializable
 */
export type Command<
  TState extends unknown = any,
  TAction extends unknown = any
> = (state: TState) => TAction | Command<TState, TAction> | (TAction | Command<TState, TAction>)[]

/**
 * Dispatches an action or command, causing the corresponding state changes.
 * For commands, all actions (determined recursively) that are returned are dispatched in turn.
 */
export type Dispatch<
  TState extends unknown = any,
  TAction extends unknown = any
> = (action: TAction | Command<TState, TAction>) => void

/**
 * Dispatches an action or executes a command, causing the corresponding state changes.
 * For commands, all actions (determined recursively) that are returned are dispatched in turn.
 * The state after executing the action is returned by this function.
 */
export type Apply<
  TState extends unknown = any,
  TAction extends unknown = any
> = (action: TAction | Command<TState, TAction>) => TState

/**
 * Creates a global state store, which is an object with the following functions:
 *
 *   - apply: an Apply function, for synchronous update-and-retrieve operations
 *   - dispatch: a write-only function for dispatching actions
 *   - getState: function to retrieve the current state of the store
 */
export const createStore = <TState extends unknown = any, TAction extends unknown = any>(
  reducer: (state: TState, action: TAction) => TState,
  initialState: TState
) => {
  let currentState = initialState

  const reduceCommandResult = (state: TState, commandResult: TAction | Command<TState, TAction>): TState => {
    if (isFunction(commandResult)) {
      return apply(commandResult)
    } else {
      return reducer(state, commandResult)
    }
  }

  const apply: Apply<TState, TAction> = (commandOrAction: TAction | Command<TState, TAction>) => {
    if (isFunction(commandOrAction)) {
      currentState = reduce(reduceCommandResult)(currentState)(castArray(commandOrAction(currentState)))
    } else {
      currentState = reducer(currentState, commandOrAction)
    }

    return currentState
  }

  const dispatch: Dispatch<TState, TAction> = (commandOrAction: TAction | Command<TState, TAction>) => {
    // applies the state without returning, may be used for asynchronous optimizations later
    apply(commandOrAction)
  }

  const getState = (): TState => currentState

  return {
    apply,
    dispatch,
    getState,
  }
}
