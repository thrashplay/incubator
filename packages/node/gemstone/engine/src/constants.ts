import { ActionResult } from './action'
import { buildEntity } from './entity'
import { buildWorldState, WorldStateBuilders } from './world-state'

const { addEntity } = WorldStateBuilders

/** Length of a game tick, in seconds. */
export const TICK_DURATION = 5

export const EMPTY_ARRAY = [] as const
export const WORLD_ID = '__world'

export const EMPTY_ACTION_RESULT: ActionResult = {
  reactions: EMPTY_ARRAY,
  transformations: EMPTY_ARRAY,
} as const

export const DEFAULT_WORLD = buildWorldState(
  addEntity(buildEntity({ id: WORLD_ID }))
)
