import { createBuilder } from '@thrashplay/fp'

import { Entity } from './entity'

/**
 * Builder function for Entity instances
 * At least one of name or id is required to create an entity. If only one is given, we use it to derive the other.
 */
export const buildEntity = createBuilder((initialValues: { id: string }): Entity => ({
  id: initialValues.id,
  facets: [],
}))
