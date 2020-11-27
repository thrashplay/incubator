import { curry } from 'lodash/fp'

import { WorldState } from '../world-state'

import { Transformation } from './transformation'

/** Applies the given transformation (function+parameter) to the world state, returning the new state. */
export const applyTransformation = curry(
  (transformation: Transformation<string, any>, world: WorldState) => transformation.transformFunction(
    world,
    transformation.parameter
  )
)
