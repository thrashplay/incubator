import { Dictionary } from '@thrashplay/gemstone-model'

import { ActionHandler } from '../action'

/** Facets provide a cluster of related state and behaviors for an entity, and can be combined dynamically. */
export type Facet<TState extends Dictionary<string, any> = never> = {
  /** Unique identifier for this facet. */
  id: string

  /** Set of default action handlers added to entities with this facet. */
  defaultActionHandlers: readonly ActionHandler[]
} & ([TState] extends [never] ? unknown : {
  /** Default state to add to an entity when it first gains this facet. If undefined, no state is added. */
  defaultState: TState
})
