import * as effects from './effects'
import { extend } from './positionable'
import * as selectors from './selectors'

export * from './positionable'
export * from './selectors'

export const Positionable = {
  ...effects,
  ...selectors,
  extend,
}
