import { createBuilder } from '@thrashplay/fp'
import { Extents, Point } from '@thrashplay/math'

import { Wall } from '../things/wall'

import { getNextThingId } from './get-next-thing-id'

const DEFAULT_WALL_THICKNESS = 1

// Wall Builders

export interface WallSpecification {
  end: Point
  start: Point
  thickness?: number
}

export interface PerpendicularWallSpecification {
  /** Length of the all to build, in feet. */
  length: number

  /** Thickness of the wall, in feet. */
  thickness?: number

  /** X-coordinate of the wall's starting point. */
  x: number

  /** Y-coordinate of the wall's starting point. */
  y: number
}

/** Build parameters for a set of alls that enclose a rectangle. */
export interface RectangleEnclosureSpecification {
  /** Position and size of the region for which to create enclosing walls. */
  bounds: Extents

  /** Thickness of the walls, in feet. */
  wallThickness?: number
}

/** Builds a single wall of a given thickness between the start and end points. */
export const buildWall = createBuilder(({
  end,
  start,
  thickness = DEFAULT_WALL_THICKNESS,
}: WallSpecification): Wall => {
  const createVerticalBounds = () => ({
    x: Math.min(start.x, end.x) - (thickness / 2),
    y: Math.min(start.y, end.y),
    width: thickness,
    height: Math.abs(end.y - start.y),
  })

  const createHorizontalBounds = () => ({
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y) - (thickness / 2),
    width: Math.abs(start.x - end.x),
    height: thickness,
  })

  const bounds = (end.x - start.x) === 0
    ? createVerticalBounds()
    : createHorizontalBounds()

  return {
    id: getNextThingId(),
    bounds,
    kind: 'wall',
    p1: start,
    p2: end,
    thickness,
  }
})

/** Builds a vertical wall segment for the given specification. */
export const buildVerticalWall = ({
  length,
  thickness = DEFAULT_WALL_THICKNESS,
  x,
  y,
}: PerpendicularWallSpecification) => buildWall({
  end: { x, y: y + length },
  start: { x, y },
  thickness,
})

/** Builds a horizontal wall segment for the given specification. */
export const buildHorizontalWall = ({
  length,
  thickness = DEFAULT_WALL_THICKNESS,
  x,
  y,
}: PerpendicularWallSpecification) => buildWall({
  end: { x: x + length, y },
  start: { x, y },
  thickness,
})

/**
 * Builds a set of enclosing walls for a rectangular region.
 * Walls of the desired thickness will be created that immediately surround the region, but
 * do not overlap it. This means the size of the region will not be reduced by the walls, but
 * instead the walls will take up space outside the region.
 *
 * The walls are returned in a counterclockwise order, starting with the north:
 *
 *   - North
 *   - West
 *   - South
 *   - East
 *
 * The indexes in the result array are stored as constants, exported as WallSides.
 */
export const buildEnclosingWalls = ({
  bounds,
  wallThickness = DEFAULT_WALL_THICKNESS,
}: RectangleEnclosureSpecification) => [
  // north
  buildHorizontalWall({
    length: bounds.width + (wallThickness * 2),
    thickness: wallThickness,
    x: bounds.x - wallThickness,
    y: bounds.y - (wallThickness / 2),
  }),

  // west
  buildVerticalWall({
    length: bounds.height + (wallThickness * 2),
    thickness: wallThickness,
    x: bounds.x - (wallThickness / 2),
    y: bounds.y - wallThickness,
  }),

  // south
  buildHorizontalWall({
    length: bounds.width + (wallThickness * 2),
    thickness: wallThickness,
    x: bounds.x - wallThickness,
    y: (bounds.y + bounds.height) + (wallThickness / 2),
  }),

  // east
  buildVerticalWall({
    length: bounds.height + (wallThickness * 2),
    thickness: wallThickness,
    x: (bounds.x + bounds.width) + (wallThickness / 2),
    y: bounds.y - wallThickness,
  }),
]

/** Constants containing the indices for the walls returned by buildEnclosingWalls */
export const WallSides = {
  North: 0,
  West: 1,
  South: 2,
  East: 3,
}

export const WallBuilder = {
  set: (values: Partial<Wall>) => (initial: Wall) => ({ ...initial, ...values }),
}
