import { useCoordinateConverter } from '@thrashplay/canvas-with-tools'
import { Point } from '@thrashplay/math'

import { RENDER_SCALE } from '../constants'

/**
 * Returns a pair of coordinate conversion functions: toViewport and toWorld.
 * These functions are used to convert coordinates in one coordinate system to the other.
 */
export const useWorldCoordinateConverter = (renderScale = RENDER_SCALE) => {
  const { toViewport } = useCoordinateConverter()

  const toCanvas = ({ x, y }: Point) => ({
    x: x * renderScale,
    y: y * renderScale,
  })

  return {
    toViewport,
    toCanvas,
  }
}
