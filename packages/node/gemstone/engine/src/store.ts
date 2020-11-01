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
  TEvent extends unknown = any
> = (state: TState) => TEvent | Command<TState, TEvent> | (TEvent | Command<TState, TEvent>)[]

export type CommandResult<
  TState extends unknown = any,
  TEvent extends unknown = any
> = ReturnType<Command<TState, TEvent>>

export type Dispatchable<
  TState extends unknown = any,
  TEvent extends unknown = any
> = TEvent | Command<TState, TEvent>

/**
 * Dispatches an action or command, causing the corresponding state changes.
 * For commands, all actions (determined recursively) that are returned are dispatched in turn.
 */
export type Dispatch<
  TState extends unknown = any,
  TEvent extends unknown = any
> = (message: Dispatchable<TState, TEvent>) => void

/**
 * Dispatches an action or executes a command, causing the corresponding state changes.
 * For commands, all actions (determined recursively) that are returned are dispatched in turn.
 * The state after executing the action is returned by this function.
 */
export type Apply<
  TState extends unknown = any,
  TEvent extends unknown = any
> = (message: Dispatchable<TState, TEvent>) => TState

export interface Store<
  TState extends unknown = any,
  TEvent extends unknown = any
> {
  apply: Apply<TState, TEvent>
  dispatch: Dispatch<TState, TEvent>
  getState: () => TState
}

/**
 * Creates a global state store, which is an object with the following functions:
 *
 *   - apply: an Apply function, for synchronous update-and-retrieve operations
 *   - dispatch: a write-only function for dispatching actions
 *   - getState: function to retrieve the current state of the store
 */
export const createStore = <TState extends unknown = any, TEvent extends unknown = any>(
  reducer: (state: TState, event: TEvent) => TState,
  initialState: TState
): Store<TState, TEvent> => {
  let currentState = initialState

  const apply: Apply<TState, TEvent> = (commandOrEvent: TEvent | Command<TState, TEvent>) => {
    const reduceCommandResult = (_: TState, commandResult: TEvent | Command<TState, TEvent>): TState => {
      return apply(commandResult)
    }

    if (isFunction(commandOrEvent)) {
      const messagesFromCommand = castArray(commandOrEvent(currentState))
      currentState = reduce(reduceCommandResult)(currentState)(messagesFromCommand)
    } else {
      currentState = reducer(currentState, commandOrEvent)
    }

    return currentState
  }

  const dispatch: Dispatch<TState, TEvent> = (commandOrEvent: TEvent | Command<TState, TEvent>) => {
    // applies the state without returning, may be used for asynchronous optimizations later
    apply(commandOrEvent)
  }

  const getState = (): TState => currentState

  return {
    apply,
    dispatch,
    getState,
  }
}
