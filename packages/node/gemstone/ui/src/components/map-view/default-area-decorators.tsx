import { MapAreaDecoratorFunction } from './decorators'

export const MapAreaDecoratorSets = {
  Default: [] as MapAreaDecoratorFunction[],
}

export const getDefaultMapAreaDecorators = () => MapAreaDecoratorSets.Default
