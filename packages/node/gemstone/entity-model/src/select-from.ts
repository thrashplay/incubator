import { keys, reduce } from 'lodash/fp'

import { WorldState } from '@thrashplay/gemstone-engine'
import { Dictionary } from '@thrashplay/gemstone-model'

import * as positionable from './positionable/selectors'

type AnyFunction = (...args: any[]) => any
type SelectorCreator = (state: WorldState) => AnyFunction
type BoundSelectors<
  TSelectors extends Dictionary<string, SelectorCreator>
> = { [k in keyof TSelectors]: ReturnType<TSelectors[k]> }

/**
 * Creates a set of all selectors with the Game parameter partially applied.
 */
export const selectFrom = (state: WorldState) => {
  const bindSelectors = <TSelectors extends Dictionary<string, SelectorCreator> = any>(
    selectors: TSelectors
  ): BoundSelectors<TSelectors> => {
    const reduceSelectors = (result: BoundSelectors<TSelectors>, key: keyof TSelectors) => ({
      ...result,
      [key]: selectors[key](state),
    })

    return reduce(reduceSelectors)({ } as BoundSelectors<TSelectors>)(keys(selectors))
  }

  return {
    ...bindSelectors(positionable),
  }
}
