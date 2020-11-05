import { createBuilder } from '@thrashplay/fp'

import { Area } from '../state'

import { getNextAreaId } from './get-next-area-id'
import { buildWall } from './wall'

// Room Builders

export interface RoomSpecification {
  width: number
  height: number
}

const horizontalWall = (x1: number, x2: number, y: number) => buildWall({
  start: { x: x1, y },
  end: { x: x2, y },
  thickness: 5,
})

const verticalWall = (x: number, y1: number, y2: number) => buildWall({
  start: { x: x, y: y1 },
  end: { x: x, y: y2 },
})

export const buildSquareRoom = createBuilder((dimensions: RoomSpecification): Area => ({
  id: getNextAreaId(),
  bounds: {
    x: 0,
    y: 0,
    ...dimensions,
  },
  things: [
    // horizontalWall(0, width, 0 + 300),
    // horizontalWall(0, width, height + 300),
    // verticalWall(0, 0, height),
    // verticalWall(width, 0, height),
  ],
}))
