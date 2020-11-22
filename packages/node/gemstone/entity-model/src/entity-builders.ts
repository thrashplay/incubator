import * as containable from './containable/mutators'
import * as positionable from './positionable/mutators'

export { buildEntity } from '@thrashplay/gemstone-engine'

export const EntityBuilders = {
  ...containable,
  ...positionable,
}
