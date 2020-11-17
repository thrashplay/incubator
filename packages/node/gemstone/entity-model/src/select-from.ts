import { keys, reduce } from 'lodash/fp'

import { Dictionary } from '@thrashplay/gemstone-model'

import * as base from './entity/selectors'
import * as positionable from './positionable/selectors'
import { EntitiesContainer } from './state'

type AnyFunction = (...args: any[]) => any
type SelectorCreator = (state: EntitiesContainer) => AnyFunction
type BoundSelectors<
  TSelectors extends Dictionary<string, SelectorCreator>
> = { [k in keyof TSelectors]: ReturnType<TSelectors[k]> }

/**
 * Creates a set of all selectors with the Game parameter partially applied.
 */
export const selectFrom = (state: EntitiesContainer) => {
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
    ...bindSelectors(base),
    ...bindSelectors(positionable),
  }
}
