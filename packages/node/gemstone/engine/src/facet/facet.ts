import { ActionHandler } from '../action'

/** Facets provide a cluster of related state and behaviors for an entity, and can be combined dynamically. */
export type Facet = {
  /** Unique identifier for this facet. */
  id: string

  /** Set of default action handlers added to entities with this facet. */
  defaultActionHandlers: readonly ActionHandler[]
}
