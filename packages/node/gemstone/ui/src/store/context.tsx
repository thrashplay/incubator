import { noop } from 'lodash/fp'
import React, { PropsWithChildren, useCallback, useRef, useState } from 'react'

import { Action, createStore, Dispatch, GameState, reducer } from '@thrashplay/gemstone-engine'
import {
  CommonActions,
} from '@thrashplay/gemstone-model'

export type StoreContextType = {
  dispatch: Dispatch<GameState, Action>
  getState: () => GameState
}

const initialState = reducer({} as any, CommonActions.initialized())

export const StoreContext = React.createContext<StoreContextType>({
  dispatch: noop,
  getState: () => initialState,
})

export const StoreProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState(initialState)

  const store = useRef(createStore(reducer, state)).current

  // dispatches a single action, updating the game state
  const dispatch = useCallback<typeof store['dispatch']>((action) => setState(store.apply(action)), [store])

  return (
    <StoreContext.Provider value={{
      dispatch,
      getState: store.getState,
    }}>
      {children}
    </StoreContext.Provider>
  )
}
