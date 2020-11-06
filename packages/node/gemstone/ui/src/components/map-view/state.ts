import { Dimensions, Extents } from '@thrashplay/math'

export const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
}

export const INITIAL_STATE: MapViewState = {
  extents: DEFAULT_EXTENTS,
  selectedToolId: 'pan-and-zoom',
}

export interface MapViewState {
  extents: Extents
  selectedToolId: string
  viewport?: Dimensions
}
