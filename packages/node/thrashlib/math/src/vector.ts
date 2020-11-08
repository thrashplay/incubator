import { calculateDistance } from './calculate-distance'
import { Point } from './point'

export type XY = { x: number; y: number }

/** Computes a dot product. */
export const dot = ({ x: x1, y: y1 }: XY, { x: x2, y: y2 }: XY) => {
  return x1 * x2 + y1 * y2
}

/** Multiplies a vector by a scalar. */
export const multiply = ({ x, y }: XY, scalar: number) => ({
  x: x * scalar,
  y: y * scalar,
})

/** Calculates a point that is 'distance' feet away from the start point, in the direction of destination */
export const calculateLocationAlongVector = (start: Point, end: Point) => (distance: number) => {
  const totalDistance = calculateDistance(start, end)

  return {
    x: ((end.x - start.x) * (distance / totalDistance)) + start.x,
    y: ((end.y - start.y) * (distance / totalDistance)) + start.y,
  }
}
