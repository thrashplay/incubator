import { identity, noop } from 'lodash/fp'
import React, { PropsWithChildren, useCallback, useState } from 'react'

import {
  Action,
  Command,
  CommonActions,
  createExecutor,
  GameState,
  reducer,
} from '@thrashplay/gemstone-engine'

export type GemstoneContextType = {
  dispatch: (action: Action) => void
  execute: (command: Command) => void
  state: GameState
}

const initialState = reducer({} as any, CommonActions.initialized())

export const GemstoneContext = React.createContext<GemstoneContextType>({
  dispatch: identity,
  execute: noop,
  state: initialState,
})

export const GemstoneProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState(initialState)

  // dispatches a single action, updating the game state
  const dispatch = useCallback((action: Action) => setState(reducer(state, action)), [setState, state])

  // dispatches a command, possibly recursively, and updates the game state
  const execute = useCallback((command: Command) => {
    const executor = createExecutor(reducer, state)
    setState(executor(command))
  }, [setState, state])

  return (
    <GemstoneContext.Provider value={{
      dispatch,
      execute,
      state,
    }}>
      {children}
    </GemstoneContext.Provider>
  )
}
