import { useContext } from 'react'

import { FrameContext } from './context'

export const useFrameQuery = () => {
  return useContext(FrameContext).frameQuery
}
