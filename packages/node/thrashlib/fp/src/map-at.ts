import { map } from 'lodash'

export const mapAt = <T extends any = any>(index: number, mapFunc: (item: T) => T) => (items: T[]) =>
  map(items, (original, sourceIndex) => index === sourceIndex ? mapFunc(original) : original)