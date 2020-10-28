import { GameState, SelectorParameters } from '@thrashplay/gemstone-engine'

import { useGame } from './use-game'

export const useStateQuery = <TResult>(
  selector: (state: GameState, params: SelectorParameters) => TResult,
  params: SelectorParameters = {}
) => {
  const { state } = useGame()
  return selector(state, params)
}
