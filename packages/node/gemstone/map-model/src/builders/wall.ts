import { createBuilder } from '@thrashplay/fp'
import { Point } from '@thrashplay/math'

import { Wall } from '../things/wall'

import { getNextThingId } from './get-next-thing-id'

const DEFAULT_WALL_THICKNESS = 1

// Wall Builders

export interface WallSpecification {
  end: Point
  start: Point
  thickness?: number
}

export const buildWall = createBuilder(({
  end,
  start,
  thickness = DEFAULT_WALL_THICKNESS,
}: WallSpecification): Wall => {
  return {
    id: getNextThingId(),
    bounds: {
      x: start.x,
      y: start.y - (thickness / 2),
      width: end.x - start.x,
      height: thickness,
    },
    kind: 'wall',
    thickness,
  }
})

// console.log('asdf')

export const WallBuilder = {
  set: (values: Partial<Wall>) => (initial: Wall) => ({ ...initial, ...values }),
}
