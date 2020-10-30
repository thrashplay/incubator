import { castArray, get, isFunction, reduce } from 'lodash/fp'

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

export type Dispatchable<
  TState extends unknown = any,
  TAction extends unknown = any
> = TAction | Command<TState, TAction>

/**
 * Dispatches an action or command, causing the corresponding state changes.
 * For commands, all actions (determined recursively) that are returned are dispatched in turn.
 */
export type Dispatch<
  TState extends unknown = any,
  TAction extends unknown = any
> = (message: Dispatchable<TState, TAction>) => void

/**
 * Dispatches an action or executes a command, causing the corresponding state changes.
 * For commands, all actions (determined recursively) that are returned are dispatched in turn.
 * The state after executing the action is returned by this function.
 */
export type Apply<
  TState extends unknown = any,
  TAction extends unknown = any
> = (message: Dispatchable<TState, TAction>) => TState

export interface Store<
  TState extends unknown = any,
  TAction extends unknown = any
> {
  apply: Apply<TState, TAction>
  dispatch: Dispatch<TState, TAction>
  getState: () => TState
}

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
): Store<TState, TAction> => {
  let currentState = initialState

  const apply: Apply<TState, TAction> = (commandOrAction: TAction | Command<TState, TAction>) => {
    const reduceCommandResult = (_: TState, commandResult: TAction | Command<TState, TAction>): TState => {
      console.log('RECU:', commandResult)

      const r = apply(commandResult)
      console.log('out', get('actors.dan.position')(r))
      return r
    }

    console.log('applying:', commandOrAction)

    if (isFunction(commandOrAction)) {
      console.log('in', get('actors.dan.position')(currentState))

      const messagesFromCommand = castArray(commandOrAction(currentState))
      console.log('cmd:', commandOrAction, 'messages', messagesFromCommand)
      currentState = reduce(reduceCommandResult)(currentState)(messagesFromCommand)
    } else {
      console.log('reducing:', commandOrAction)
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
