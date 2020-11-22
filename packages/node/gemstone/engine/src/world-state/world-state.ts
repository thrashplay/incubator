import { RecordSet } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'

export type WorldState = {
  entities: RecordSet<Entity>
}

export const EMPTY_ARRAY = []
export const WORLD_ID = '__world'
