import { negate } from 'lodash'
import { filter, flatten, flow, get, isNil, keyBy, map, some } from 'lodash/fp'

import { ActionHandler, AnyAction } from '../action/action-handler'
import { Entity } from '../entity'
import { Facet } from '../facet'

/** Creates an action handler for an entity, based on the characteristics of the entity. */
export type ActionHandlerFactory = (entity: Entity) => ActionHandler

/**
 * Creates an ActionHandlerFactory that will handle actions based on an entity's facets.
 * The list of all facets to support must be provided.
 *
 * TODO: test this!
 */
export const createActionHandlerFactory = (allFacets: Facet[]) => {
  const facetMap = keyBy('id', allFacets)

  /** Gets the facet, from 'allFacets', with the specified ID. */
  const getFacet = (facetId: string) => facetMap[facetId]

  /** Higher order function used as a predicate to determine if any handler in a collection supports an action. */
  const anyHandlerSupports = (handlers: ActionHandler[]) => (action: AnyAction): action is AnyAction =>
    some((handler: ActionHandler) => handler.supports(action))(handlers)

  return (entity: Entity): ActionHandler => {
    const facets: Facet[] = flow(
      map(getFacet),
      filter(negate(isNil))
    )(entity.facets)

    const handlers = flow(
      map(get('defaultActionHandlers')),
      flatten
    )(facets)

    return {
      handle: () => {
        throw new Error('Handle not implemented!')
      },
      supports: anyHandlerSupports(handlers),
    }
  }
}
