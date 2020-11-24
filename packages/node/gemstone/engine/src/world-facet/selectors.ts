import { isNil } from 'lodash'
import { Maybe } from 'monet'

import { WORLD_ID } from '../constants'
import { createEntitySelector, MightBe } from '../entity'
import { WorldState } from '../world-state'

import { World } from './facet'

const getTimeFromEntity = createEntitySelector((
  _state,
  entity: MightBe<World>
): Maybe<number> => {
  return isNil(entity.time)
    ? Maybe.Nothing()
    : Maybe.Just(entity.time)
})

export const getWorldTime = (world: WorldState) => getTimeFromEntity(world)(WORLD_ID)
