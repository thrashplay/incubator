import { Extents, Point } from '@thrashplay/math'

import { RENDER_SCALE } from '../constants'

/**
 * Returns a pair of coordinate conversion functions: toViewport and toWorld.
 * These functions are used to convert coordinates in one coordinate system to the other.
 */
export const useWorldCoordinateConverter = (renderScale = RENDER_SCALE) => {
  const toCanvas = ({ x, y }: Point) => ({
    x: x * renderScale,
    y: y * renderScale,
  })

  const extentsToCanvas = ({ x, y, width, height }: Extents) => ({
    height: height * renderScale,
    width: width * renderScale,
    x: x * renderScale,
    y: y * renderScale,
  })

  return {
    extentsToCanvas,
    toCanvas,
  }
}
