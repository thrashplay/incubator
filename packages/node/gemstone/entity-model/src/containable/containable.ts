import { Dictionary } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'

import * as selectors from './selectors/containable'

export type Containable = {
  containerId: Entity['id'] | undefined
}

/** Extends an entity with Containable state. */
const extend = <
  TFacets extends Dictionary<string, any> = Dictionary<string, any>
>(entity: Entity<TFacets>): Entity<TFacets & Containable> => ({
  ...entity,
  containerId: undefined,
})

export const Containable = {
  ...selectors,
  extend,
}
