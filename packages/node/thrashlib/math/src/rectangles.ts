import { Extents } from './extents'
import { Point } from './point'

/** Returns true if the rectangle defined by the bounds parameter contains the given Point. */
export const rectangleContains = (bounds: Extents, point: Point) => {
  // For rotated rectangles, see Reference: https://stackoverflow.com/a/2763387
  // would have to be defined differently to (with points instead of bounds)

  return point.x >= bounds.x &&
    point.x < (bounds.x + bounds.height) &&
    point.y >= bounds.y &&
    point.y < (bounds.y + bounds.height)
}
