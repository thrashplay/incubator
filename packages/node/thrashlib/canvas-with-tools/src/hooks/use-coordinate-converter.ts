import { CoordinateConverter } from '../coordinate-helpers'

import { useViewport } from './use-viewport'

/**
 * Returns a pair of coordinate conversion functions: toViewport and toWorld.
 * These functions are used to convert coordinates in one coordinate system to the other.
 */
export const useCoordinateConverter = () => {
  const { extents, viewport } = useViewport()
  const converter = new CoordinateConverter(extents, viewport)

  return {
    toViewport: converter.toViewport.bind(converter),
    toWorld: converter.toWorld.bind(converter),
  }
}
