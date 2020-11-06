import { Dimensions, Extents } from '@thrashplay/math'

import { calculateScale } from './coordinate-helpers'

// calculates new extents whenever the viewport changes
// current implementation is to ??
export const adjustExtentsForViewport = (
  extents: Extents,
  oldViewport: Dimensions | undefined,
  newViewport: Dimensions
) => {
  // if we didn't have an old viewport, center the extents in the current viewport by adjusting for aspect ratio
  if (oldViewport?.width === 0 || oldViewport?.height === 0) {
    const scale = calculateScale(extents, newViewport)

    const extentsWidthInPixels = extents.width * scale
    const extentsHeightInPixels = extents.height * scale
    const extraPixelWidth = newViewport.width - extentsWidthInPixels
    const extraPixelHeight = newViewport.height - extentsHeightInPixels
    const extraWidth = extraPixelWidth / scale
    const extraHeight = extraPixelHeight / scale

    return {
      x: extents.x - extraWidth / 2,
      y: extents.y - extraHeight / 2,
      width: extents.width + extraWidth,
      height: extents.height + extraHeight,
    }
  } else {
    return extents
  }
}
