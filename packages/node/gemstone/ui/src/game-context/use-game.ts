import { useContext } from 'react'

import { GemstoneContext } from './context'

export const useGame = () => {
  return useContext(GemstoneContext)
}
