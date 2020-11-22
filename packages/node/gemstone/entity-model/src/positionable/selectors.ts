import { isNil } from 'lodash'
import { get } from 'lodash/fp'
import { Maybe } from 'monet'

import { createEntitySelector, MightBe } from '@thrashplay/gemstone-engine'
import { Point } from '@thrashplay/math'

import { Containable } from '../containable'

import { Positionable } from './positionable'

const { getContainer } = Containable

/**
 * Selects the position of an entity, if it is either (a) inside a Positionable container (in which case the container's
 * position is used), or (b) itself Positionable.
 *
 * Ifs the entity is inside nested containers, the outermost containing entity with a position will be used.
 */
export const getPosition = createEntitySelector(
  (game, entity: MightBe<Containable & Positionable>): Maybe<Point> => {
    const container = getContainer(game)(entity)
    const entityPosition = get('position', entity)
    return container.isSome()
      ? getPosition(game)(container)
      : isNil(entityPosition) ? Maybe.Nothing() : Maybe.Just(entityPosition)
  })
