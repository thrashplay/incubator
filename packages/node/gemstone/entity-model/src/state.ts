import { RecordSet } from '@thrashplay/gemstone-model'

import { Entity } from './entity'

export type EntitiesContainer = {
  entities: RecordSet<Entity>
}
