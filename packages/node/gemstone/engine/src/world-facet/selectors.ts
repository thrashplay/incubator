import { isNil } from 'lodash'
import { Maybe } from 'monet'

import { createEntitySelector, MightBe } from '../entity'
import { WORLD_ID, WorldState } from '../world-state'

import { World } from './world'

const getTimeFromEntity = createEntitySelector((
  _state,
  entity: MightBe<World>
): Maybe<number> => {
  return isNil(entity.time)
    ? Maybe.Nothing()
    : Maybe.Just(entity.time)
})

export const getWorldTime = (world: WorldState) => getTimeFromEntity(world)(WORLD_ID)
