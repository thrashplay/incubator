import { Point } from '@thrashplay/gemstone-model'

/** calculates a point that is 'distance' feet away from the start point, in the direction of destination */
export const calculateLocationAlongVector = (start: Point, destination: Point) => (distance: number) => {
  const totalDistance = Math.sqrt(
    (destination.y - start.y) * (destination.y - start.y) +
    (destination.x - start.x) * (destination.x - start.x)
  )

  return {
    x: ((destination.x - start.x) * (distance / totalDistance)) + start.x,
    y: ((destination.y - start.y) * (distance / totalDistance)) + start.y,
  }
}

/** calculates the distance between two points */
export const calculateDistance = (p1: Point, p2: Point) => Math.sqrt(
  (p2.y - p1.y) * (p2.y - p1.y) +
  (p2.x - p1.x) * (p2.x - p1.x)
)

/**
 * Calculates how far a character with the given speed could move towards a goal in one segment
 * This function accounts for reaching the goal, and so the result is the lesser of the character's
 * fastest possible movement, and the distance between the origin and the destination.
 */
export const getNextSegmentDistance = (start: Point, destination: Point, speed: number) => {
  return Math.min(getMaxDistance(speed, 1), calculateDistance(start, destination))
}

/** given a speed (in feet per round), and time (in segments), return the maximum allowed movement */
export const getMaxDistance = (speed: number, segments: number) => speed * (segments / 12)

export const getNewPosition = (origin: Point, destination: Point, speed: number, _ignored?: any) => {
  const requestedDistance = calculateDistance(origin, destination)

  const maxDistance = getNextSegmentDistance(origin, destination, speed)
  const distance = Math.min(maxDistance, requestedDistance)

  return calculateLocationAlongVector(origin, destination)(distance)
}

/**
 * When starting at 'start', and approaching 'end' at the given speed, calculate the end point for a single
 * segment's worth of movement. If specified, the approach will not intentionally get any closer than the
 * 'minDistance' value.
 */
export const getNextPositionOnApproach = (start: Point, end: Point, speed: number, minDistance = 0) => {
  // this helper is written to get distance from the start point, so we reverse our argument order
  const trueDestination = calculateLocationAlongVector(end, start)(minDistance)
  return getNewPosition(start, trueDestination, speed)
}
