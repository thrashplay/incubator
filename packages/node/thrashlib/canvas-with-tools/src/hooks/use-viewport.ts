import { useContext } from 'react'

import { CanvasContext } from '../context'

export const useViewport = () => {
  const { extents, viewport } = useContext(CanvasContext)
  return { extents, viewport }
}
