import { useContext } from 'react'

import { GameState } from '@thrashplay/gemstone-engine'
import { SelectorParameters } from '@thrashplay/gemstone-model'

import { StoreContext } from './context'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useDispatch = () => {
  return useStore().dispatch
}

export const useSelector = <TResult>(
  selector: (state: GameState, params: SelectorParameters) => TResult
) => {
  const { getState } = useStore()

  return (params: SelectorParameters = {}) => selector(getState(), params)
}

export const useValue = <TResult>(
  selector: (state: GameState, params: SelectorParameters) => TResult,
  params: SelectorParameters = {}
) => {
  const { getState } = useStore()
  return selector(getState(), params)
}
