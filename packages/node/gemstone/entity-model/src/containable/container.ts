import { Dictionary } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'
import { EMPTY_ARRAY } from '../state'

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
  ...selectors,
  extend,
}
