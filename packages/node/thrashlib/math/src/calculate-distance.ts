import { Point } from './point'

/** calculates the distance between two points */
export const calculateDistance = (p1: Point, p2: Point) => Math.sqrt(
  (p2.y - p1.y) * (p2.y - p1.y) +
  (p2.x - p1.x) * (p2.x - p1.x)
)
