import { createBuilder } from '@thrashplay/fp'
import { Extents, Point } from '@thrashplay/math'

import { getNextThingId } from '..'
import { isHorizontalWall } from '../things/predicates'
import { Break, Wall } from '../things/wall'

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

export interface PassageSpecification {
  p1: Point
  p2: Point
  wallThickness?: number
  width?: number
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
  return {
    id: getNextThingId(),
    breaks: [],
    kind: 'wall',
    p1: start,
    p2: end,
    thickness,
  }
})

/** Builds a vertical wall segment for the given specification. */
export const buildVerticalWall = createBuilder(({
  length,
  thickness = DEFAULT_WALL_THICKNESS,
  x,
  y,
}: PerpendicularWallSpecification) => buildWall({
  end: { x, y: y + length },
  start: { x, y },
  thickness,
}))

/** Builds a horizontal wall segment for the given specification. */
export const buildHorizontalWall = createBuilder(({
  length,
  thickness = DEFAULT_WALL_THICKNESS,
  x,
  y,
}: PerpendicularWallSpecification) => buildWall({
  end: { x: x + length, y },
  start: { x, y },
  thickness,
}))

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

/**
 * Builds a pair of side walls for an axis-aligned straight passage.
 * Walls of the desired thickness will be created adjacent to the passage, which will have
 * the request width.
 *
 * The walls are returned in the following order:
 *
 * - For horizontal passages:
 *   - North
 *   - South
 *
 * - For vertical passages:
 *   - East
 *   - West
 */
export const buildPassageWalls = ({
  p1,
  p2,
  wallThickness = DEFAULT_WALL_THICKNESS,
  width = 5,
}: PassageSpecification) => {
  const isVertical = p1.x === p2.x
  const isHorizontal = p1.y === p2.y

  return !isHorizontal && !isVertical
    ? []
    : isVertical
      ? [
        // west
        buildVerticalWall({
          length: (p2.y - p1.y) + (wallThickness * 2),
          thickness: wallThickness,
          x: p1.x - (wallThickness / 2),
          y: p1.y - wallThickness,
        }),
        // east
        buildVerticalWall({
          length: (p2.y - p1.y) + (wallThickness * 2),
          thickness: wallThickness,
          x: (p1.x + width) + (wallThickness / 2),
          y: p1.y - wallThickness,
        }),
      ] : [
        // north
        buildHorizontalWall({
          length: (p2.x - p1.x) + (wallThickness * 2),
          thickness: wallThickness,
          x: p1.x - wallThickness,
          y: p1.y - (wallThickness / 2),
        }),
        // south
        buildHorizontalWall({
          length: (p2.x - p1.x) + (wallThickness * 2),
          thickness: wallThickness,
          x: p1.x - wallThickness,
          y: (p1.y + width) + (wallThickness / 2),
        }),
      ]
}

/** Constants containing the indices for the walls returned by buildEnclosingWalls */
export const WallSides = {
  North: 0,
  West: 1,
  South: 2,
  East: 3,
} as const
export type WallSide = keyof typeof WallSides

const addBreak = (newBreak: Break) => (wall: Wall) => ({
  ...wall,
  breaks: [...wall.breaks, newBreak],
})

export const WallBuilder = {
  addBreak,
  set: (values: Partial<Wall>) => (initial: Wall) => ({ ...initial, ...values }),
}
