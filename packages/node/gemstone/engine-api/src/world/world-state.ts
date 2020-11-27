import { RecordSet } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'

export type WorldState = {
  entities: RecordSet<Entity>
}
