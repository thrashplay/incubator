import { noop } from 'lodash/fp'
import React, { PropsWithChildren, useCallback, useRef, useState } from 'react'

import { createStore, Dispatch, Event, GameState, reducer } from '@thrashplay/gemstone-engine-v1'
import { CommonEvents } from '@thrashplay/gemstone-model'

export type StoreContextType<TState extends unknown = any, TEvent extends { type: string } = any> = {
  dispatch: Dispatch<TState, TEvent>
  getState: () => TState
}

const initialState = reducer({} as any, CommonEvents.initialized())

export const createStoreContext = <
  TState extends unknown = any,
  TEvent extends { type: string } = any
>(dispatch: Dispatch<TState, TEvent>, getState: () => TState) => React.createContext<StoreContextType<TState, TEvent>>({
  dispatch,
  getState,
})

export interface StoreProviderProps<TState extends unknown = any, TEvent extends { type: string } = any> {
  context: React.Context<StoreContextType<TState, TEvent>>
  initialState: TState
  reducer: (state: TState, event: TEvent) => TState
}

export const StoreProvider = ({
  children,
  context,
  initialState,
  reducer,
}: PropsWithChildren<StoreProviderProps>) => {
  const [state, setState] = useState(initialState)

  const store = useRef(createStore(reducer, state)).current

  // dispatches a single action, updating the game state
  const dispatch = useCallback<typeof store['dispatch']>((action) => setState(store.apply(action)), [store])

  const StoreContext = context
  return (
    <StoreContext.Provider value={{
      dispatch,
      getState: store.getState,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const createStoreProvider = <TState extends unknown = any, TEvent extends { type: string } = any>()