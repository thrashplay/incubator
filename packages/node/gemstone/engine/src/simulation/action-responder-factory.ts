import { castArray, negate } from 'lodash'
import { filter, flatten, flow, get, isNil, keyBy, map, reduce, some } from 'lodash/fp'
import { Either } from 'monet'

import { ActionHandler, ActionResult, AnyAction } from '../action/action-handler'
import { EMPTY_ACTION_RESULT, EMPTY_ARRAY } from '../constants'
import { Entity } from '../entity'
import { Facet } from '../facet'
import { LogEntry } from '../log'

/** An ActionResponder encapsulates the behavior that an entity exhibits in response to being targeted by an action. */
export type ActionResponder = ActionHandler

/** Creates an action responder for an entity, based on the characteristics of the entity. */
export type ActionResponderFactory = (entity: Entity) => ActionHandler

/**
 * Creates an ActionResponderFactory that will respond to actions based on an entity's facets.
 * The list of all facets to support must be provided.
 *
 * TODO: test this!
 */
export const createActionResponderFactory = (allFacets: Facet[]) => {
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

    const handlers: ActionHandler[] = flow(
      map(get('defaultActionHandlers')),
      flatten
    )(facets)

    // TODO: supported actions can still faile.. what if some handlers fail and others don't?
    const reduceActionResults = (accumulator: ActionResult, current: Either<LogEntry, ActionResult>): ActionResult =>
      current.isLeft() ? accumulator : ({
        reactions: [
          ...castArray(accumulator.reactions ?? EMPTY_ARRAY),
          ...castArray(current.toMaybe().orJust(EMPTY_ACTION_RESULT).reactions ?? EMPTY_ARRAY),
        ],
        transformations: [
          ...castArray(accumulator.transformations ?? EMPTY_ARRAY),
          ...castArray(current.toMaybe().orJust(EMPTY_ACTION_RESULT).transformations ?? EMPTY_ARRAY),
        ],
      })

    return {
      handle: (action, world) => {
        return !anyHandlerSupports(handlers)(action)
          ? Either.Left(`'${action.target}' does not know how to handle '${action.type}'.`)
          : Either.Right(flow(
            filter((handler: ActionHandler) => handler.supports(action)),
            map((handler: ActionHandler) => handler.handle(action, world)),
            reduce(reduceActionResults)({ } as ActionResult)
          )(handlers))
      },
      supports: anyHandlerSupports(handlers),
    }
  }
}
