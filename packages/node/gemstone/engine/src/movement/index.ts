import { approachLocation } from './approach-location'
import { intercept } from './intercept'
import { moveTo } from './move-to'

export * from './options'
export * from './movement-utils'

export const MovementCommands = {
  approachLocation,
  intercept,
  moveTo,
}
