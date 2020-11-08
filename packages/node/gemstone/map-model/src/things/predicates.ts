import { Thing } from '../state'

import { Wall } from './wall'

/** Determines if a thing is a wall */
export const isWall = (thing?: Thing): thing is Wall => thing?.kind === 'wall'

/** Determines if a thing is a vertical wall (both x coordinates are the same) */
export const isVerticalWall = (thing?: Thing): thing is Wall =>
  isWall(thing) && thing.p1.x === thing.p2.x

/** Determines if a thing is a horizontal wall (both y coordinates are the same) */
export const isHorizontalWall = (thing?: Thing): thing is Wall =>
  isWall(thing) && thing.p1.y === thing.p2.y
