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
        const halfWidth = this.layout.metrics.width / 2
        const halfHeight = this.layout.metrics.height / 2

        // calculate minimum q and r values for populated tiles
        let minX = Number.MAX_VALUE
        let minY = Number.MAX_VALUE
        let maxX = Number.MIN_VALUE
        let maxY = Number.MIN_VALUE
        forEach([...this._tiles.keys()], ([q, r]) => {
          const xy = this.layout.hexToPixel({ q, r })
          const left = xy.x - halfWidth
          const right = xy.x + halfWidth
          const top = xy.y - halfHeight
          const bottom = xy.y + halfHeight

          if (left < minX) {
            minX = left
          }
          if (right > maxX) {
            maxX = right
          }
          if (top < minY) {
            minY = top
          }
          if (bottom > maxY) {
            maxY = bottom
          }
        })

        this._extents = {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
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
