import { Dictionary } from '@thrashplay/gemstone-model'
import { Extents } from '@thrashplay/math'

/** A physical person or object in the game world */
export type Thing = {
  id: string
  kind: string
}

/** Type for a general region in a map space (room, chamber, hallway) */
export type Area = {
  /** unique identifier for this area */
  id: string

  /** the dimensions and position of this area, in feet */
  bounds: Extents

  /** list of IDs for the things in this area */
  things: string[]
}

/** Represents a map of some part of the game world */
export interface MapData {
  /** Dictionary of Area instances, allowing lookup by ID */
  areas: Dictionary<string, Area>

  /** Dictionary of Thing instances, allowing lookup by ID */
  things: Dictionary<string, Thing>
}

export interface MapStateContainer {
  map: MapData
}
