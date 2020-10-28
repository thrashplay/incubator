import { Point } from '../types'

import { Intention } from './intentions'
import { Q } from './selectors'
import { ActorId, SceneStateContainer } from './state'

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

/** given a speed (in feet per round), and time (in segments), return the maximum allowed movement */
export const getMaxDistance = (speed: number, segments: number) => speed * (segments / 12)

export const getNewPosition = (origin: Point, destination: Point, speed: number, time: number) => {
  const requestedDistance = calculateDistance(origin, destination)

  const maxDistance = getMaxDistance(speed, time)
  const distance = Math.min(maxDistance, requestedDistance)

  return calculateLocationAlongVector(origin, destination)(distance)
}

/** updates an actor by setting their position to the specified coordinates */
export const setPosition = (
  actorId: ActorId,
  position: Point
) => (state: SceneStateContainer): SceneStateContainer => {
  const actor = Q.actor(state, { characterId: actorId })

  return actor === undefined ? state : {
    ...state,
    scene: state.scene === undefined ? undefined : {
      ...state.scene,
      currentFrame: {
        ...state.scene.currentFrame,
        actors: {
          ...state.scene.currentFrame.actors,
          [actor.id]: {
            ...actor,
            position,
          },
        },
      },
    },
  }
}

/** updates an actor by moving them towards a destination at max speed for the given number of segments */
export const moveTowards = (
  actorId: ActorId,
  destination: Point,
  duration: number
) => (state: SceneStateContainer): SceneStateContainer => {
  const actor = Q.actor(state, { characterId: actorId })

  const newPosition = getNewPosition(
    Q.position(state, { characterId: actor!.id }),
    destination,
    Q.effectiveSpeed(state, { characterId: actor!.id }),
    duration
  )

  return actor === undefined ? state : setPosition(actorId, newPosition)(state)
}

/** clears a move intention if the actor reaches a location whthin 'maxDistance' (in feet) of the destination */
export const handleArrival = (
  actorId: ActorId,
  destination: Point,
  nextIntention: Intention,
  maxDistance = 2
) => (state: SceneStateContainer): SceneStateContainer => {
  const actor = Q.actor(state, { characterId: actorId })

  return actor === undefined ? state : {
    ...state,
    scene: state.scene === undefined ? undefined : {
      ...state.scene,
      currentFrame: {
        ...state.scene.currentFrame,
        actors: {
          ...state.scene.currentFrame.actors,
          [actor.id]: {
            ...actor,
            intention: calculateDistance(Q.position(state, { characterId: actorId }), destination) <= maxDistance
              ? nextIntention
              : actor.intention,
          },
        },
      },
    },
  }
}
