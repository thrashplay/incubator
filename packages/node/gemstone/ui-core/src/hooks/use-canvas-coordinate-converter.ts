import { CoordinateConverter, useViewport } from '@thrashplay/canvas-with-tools'

import { RENDER_SCALE } from '../constants'

/**
 * Returns a pair of coordinate conversion functions: toViewport and toWorld.
 * These functions are used to convert coordinates in one coordinate system to the other.
 */
export const useCanvasCoordinateConverter = (renderScale = RENDER_SCALE) => {
  const { extents, viewport } = useViewport()

  const scaledExtents = {
    height: extents.height / renderScale,
    width: extents.width / renderScale,
    x: extents.x / renderScale,
    y: extents.y / renderScale,
  }

  const converter = new CoordinateConverter(scaledExtents, viewport)

  return {
    toViewport: converter.toViewport.bind(converter),
    toWorld: converter.toWorld.bind(converter),
  }
}
