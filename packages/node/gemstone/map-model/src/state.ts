import { Dictionary } from '@thrashplay/gemstone-model'
import { Extents } from '@thrashplay/math'

/** A physical person or object in the game world */
export type Thing = {
  id: string
  kind: string
}

/** Type for a general region in a map space (room, chamber, passage) */
export type Area = {
  /** unique identifier for this area */
  id: string

  /** the dimensions and position of this area, in feet */
  bounds: Extents

  /** the type of area */
  kind: 'chamber' | 'passage' | 'room'

  /** list of IDs for the things in this area */
  things: string[]

  wallIds: string[]
}

// export type PassageEnd = {
//   kind: 'deadend'

//   /** the ID of the wall blocking this deadend */
//   wallId: Wall['id']
// } | {
//   kind: 'opening'
//   // how to define the wall id.. what if the wall is parallel to the passage?
// }

// /** Specific type for 'passage' Areas */
// export type Passage = Area & {
//   kind: 'passage'

//   /** data describing the first end of this passage */
//   end1: PassageEnd

//   /** data describing the second end of this passage */
//   end2: PassageEnd

//   /** the two walls comprising the sides of this passage */
//   wallIds: [Wall['id'], Wall['id']]
// }

/** Type for a link between two map areas. */
// export type AreaLink = {
//   id: string
//   area1: Area
//   area2: Area
// }

/** Represents a map of some part of the game world */
export interface MapData {
  /** Dictionary of Area instances, allowing lookup by ID */
  areas: Dictionary<Area['id'], Area>

  /** Dictionary of AreaLink instances, allowing lookup by ID */
  // links: Dictionary<AreaLink['id'], AreaLink>

  /** Dictionary of Thing instances, allowing lookup by ID */
  things: Dictionary<Thing['id'], Thing>
}

export interface MapStateContainer {
  map: MapData
}
