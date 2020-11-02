import { calculateDistance } from './calculate-distance'
import { Point } from './point'
import { dot, multiply } from './vector'

// Reference: https://www.codeproject.com/articles/990452/interception-of-two-moving-objects-in-d-space

const getMovementVector = (start: Point, end: Point, speed: number) => {
  const totalDistance = calculateDistance(start, end)

  return {
    x: ((end.x - start.x) * (speed / totalDistance)),
    y: ((end.y - start.y) * (speed / totalDistance)),
  }
}

export const calculateIntercept = (
  chaserPosition: Point, // Pc
  chaserSpeed: number, // Sc
  targetPosition: Point, // Pr
  targetDestination: Point,
  targetSpeed: number,
  maxDelta = 1
) => {
  const doGetInterceptPosition = () => {
    // D
    const chaserToTargetVector = {
      x: chaserPosition.x - targetPosition.x,
      y: chaserPosition.y - targetPosition.y,
    }

    // Vr
    const targetMovementVector = getMovementVector(targetPosition, targetDestination, targetSpeed)

    // d
    const d = calculateDistance(chaserPosition, targetPosition)

    const a = chaserSpeed * chaserSpeed - targetSpeed * targetSpeed
    const b = 2 * dot(chaserToTargetVector, targetMovementVector)
    const c = -(d * d)

    const squarePortion = (b * b) - (4 * a * c)

    const calculateInterceptTime = () => {
      const t1 = (-b + Math.sqrt(squarePortion)) / (2 * a)
      const t2 = (-b - Math.sqrt(squarePortion)) / (2 * a)

      return t1 < 0
        ? t2 < 0
          ? undefined // both negative = no intercept possible
          : t2 // only t2 positive, use that
        : t2 < 0
          ? t1 // only t1 positive, use that
          : Math.min(t1, t2) // use the lower time value
    }

    const calculateInterceptTimeWhenSpeedsAreEqual = () => {
      const t = -(c / b)
      return t < 0 ? undefined : t
    }

    const calculateInterceptPosition = () => {
      const t = a === 0
        ? calculateInterceptTimeWhenSpeedsAreEqual()
        : calculateInterceptTime()

      const scaledMovementVector = multiply(targetMovementVector, t ?? 1)
      return t === undefined
        ? undefined
        : {
          x: targetPosition.x + scaledMovementVector.x,
          y: targetPosition.y + scaledMovementVector.y,
        }
    }

    return squarePortion < 0
      ? undefined
      : calculateInterceptPosition()
  }

  // early return for some edge cases before calculating
  return calculateDistance(chaserPosition, targetPosition) < maxDelta
    ? targetPosition // two positions are already close enough, no intercept needed
    : chaserSpeed === 0
      ? undefined // chaser cannot move, no intercept possible
      : doGetInterceptPosition()
}
