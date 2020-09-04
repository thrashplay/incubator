import ArrayKeyedMap from 'array-keyed-map'
import { forEach, isNil } from 'lodash'

import { HexCoordinates, HexLayout, HexOrientationType } from '@thrashplay/hex-utils'

export interface TerrainType {
  key: string
  name: string
}

export interface Tile {
  coordinates: HexCoordinates
  terrainType: TerrainType
}

export type TileData = ArrayKeyedMap<number[], Tile>

export type DistanceUnit = 'miles'

interface Extents {
  x: number
  y: number
  width: number
  height: number
}

/**
 * A map representing a region in a world.
 */
export interface MapData {
  /** The full extents that includes all populated tiles for this map */
  extents: Extents

  /** The hex grid layout for this map */
  layout: HexLayout

  /** Human-readable name of this map */
  name: string

  /** Scale of the map, which is the distance (in `scaleUnit) from one side of a hex to the opposite side */
  scale: number

  /** Unit of measure for the scale value */
  scaleUnit: DistanceUnit

  /** Actual tile data comprising this map */
  tiles: TileData
}

export class Map implements MapData {
  private _extents: Extents | undefined
  private _layout: HexLayout
  private _tiles: TileData

  constructor (
    public name: string,
    scale: number,
    public scaleUnit: DistanceUnit = 'miles',
    orientation: HexOrientationType = 'Flat'
  ) {
    this._layout = HexLayout.createFromApothem(scale / 2, orientation)
    this._tiles = new ArrayKeyedMap<number[], Tile>()
  }

  public get extents () {
    if (isNil(this._extents)) {
      if (this._tiles.size === 0) {
        this._extents = {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }
      } else {
        // calculate minimum q and r values for populated tiles
        let minQ = Number.MAX_VALUE
        let minR = Number.MAX_VALUE
        let maxQ = Number.MIN_VALUE
        let maxR = Number.MIN_VALUE
        forEach([...this._tiles.keys()], ([q, r]) => {
          if (q < minQ) {
            minQ = q
          }
          if (q > maxQ) {
            maxQ = q
          }
          if (r < minR) {
            minR = r
          }
          if (r > maxR) {
            maxR = r
          }
        })

        const topLeft = this._layout.hexToPixel({ q: minQ, r: minR })
        const bottomRight = this._layout.hexToPixel({ q: maxQ, r: maxR })

        this._extents = {
          x: topLeft.x,
          y: topLeft.x,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.x,
        }
      }
    }

    return this._extents
  }

  public get layout () {
    return this._layout
  }

  public get scale () {
    return this._layout.metrics.diameter
  }

  public get tiles () {
    return this._tiles
  }
}
