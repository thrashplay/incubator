import { AreaShapes, MapAreaDecoratorFunction } from '@thrashplay/gemstone-map-ui'

export const MapAreaDecoratorSets = {
  Default: [AreaShapes.Default] as MapAreaDecoratorFunction[],
}

export const getDefaultMapAreaDecorators = () => MapAreaDecoratorSets.Default
