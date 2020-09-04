import { applyToPoint, compose, inverse, Matrix, scale, translate } from 'transformation-matrix'

import { Dimensions, Extents, Point } from './types'

export const calculateScale = (extents: Extents, viewport: Dimensions) => {
  const scaleX = viewport.width / extents.width
  const scaleY = viewport.height / extents.height
  return Math.min(scaleX, scaleY)
}

/**
 * Utility class providing methods for converting between viewport coordinates and world coordinates.
 */
export class CoordinateConverter {
  private _toViewport: Matrix
  private _toWorld: Matrix

  constructor (
    extents: Extents,
    viewport: Dimensions
  ) {
    const scaleFactor = calculateScale(extents, viewport)

    this._toViewport = compose(
      scale(scaleFactor, scaleFactor),
      translate(-extents.x, -extents.y)
    )
    this._toWorld = inverse(this._toViewport)
  }

  public toViewport (worldCoordinates: Point) {
    return applyToPoint(this._toViewport, worldCoordinates)
  }

  public toWorld (viewportCoordinates: Point) {
    return applyToPoint(this._toWorld, viewportCoordinates)
  }
}
