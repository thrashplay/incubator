import { WorldState } from '../world-state'

import { OptionalRestParameter } from './type-helpers'

/**
 * A Transformation encodes a parameterized change to the simulation's World state. It has a string representing
 * the type of transformation, a function that is able to calculate updated state, and an optional type-specific
 * parameter value.
 */
export type Transformation<
  TType extends string = string,
  TParameter extends any = never
> = {
  transformFunction: (world: WorldState, ...parameter: OptionalRestParameter<TParameter>) => WorldState
  type: TType
} & ([TParameter] extends [never] ? unknown : { parameter: TParameter })
