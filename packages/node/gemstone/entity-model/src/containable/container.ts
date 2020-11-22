import { EMPTY_ARRAY, Entity } from '@thrashplay/gemstone-engine'
import { Dictionary } from '@thrashplay/gemstone-model'

import * as effects from './effects'
import * as selectors from './selectors/container'

export type Container = {
  /** IDs for the entities inside this container */
  contents: Entity['id'][]
}

/** Extends an entity with Container state. */
const extend = <
  TFacets extends Dictionary<string, any> = Dictionary<string, any>
>(entity: Entity<TFacets>): Entity<TFacets & Container> => ({
  ...entity,
  contents: EMPTY_ARRAY,
})

export const Container = {
  ...effects,
  ...selectors,
  extend,
}
