import { TransformationSet } from '../transformation/types'

export type GemstonePlugin = Readonly<{
  id: string
  transformations?: TransformationSet
}>
