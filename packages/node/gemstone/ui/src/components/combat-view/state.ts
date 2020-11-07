import { Actor } from '@thrashplay/gemstone-model'
import { Dimensions, Extents } from '@thrashplay/math'

export interface CombatViewState {
  extents: Extents
  highlights: { [k in string]?: boolean }
  selectedActorId?: Actor['id']
  selectedToolId: string
  viewport?: Dimensions
}

export const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: -250,
  y: -250,
}

export const INITIAL_STATE: CombatViewState = {
  extents: DEFAULT_EXTENTS,
  highlights: {},
  selectedToolId: 'pan-and-zoom',
}
