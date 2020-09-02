import { has, isNil } from 'lodash'

import { HexDirection } from './types'

export type AxialCoordinates = { q: number; r: number }
export type CubeCoordinates = AxialCoordinates & { s: number }
export type AxialCoordinatesXY = { x: number; y: number }
export type CubeCoordinatesXYZ = AxialCoordinatesXY & { z: number }
export type OffsetCoordinates = unknown

export const isAxialCoordinates = (coordinates: any): coordinates is AxialCoordinates => {
  return has(coordinates, 'q') && has(coordinates, 'r')
}
export const isAxialCoordinatesXY = (coordinates: any): coordinates is AxialCoordinatesXY => {
  return has(coordinates, 'x') && has(coordinates, 'y')
}
export const isCubeCoordinates = (coordinates: any): coordinates is CubeCoordinates => {
  return has(coordinates, 'q') && has(coordinates, 'r') && has(coordinates, 's')
}
export const isCubeCoordinatesXYZ = (coordinates: any): coordinates is CubeCoordinatesXYZ => {
  return has(coordinates, 'x') && has(coordinates, 'r') && has(coordinates, 's')
}

export const toAxial = (coordinates: AxialCoordinates | CubeCoordinates): AxialCoordinates => coordinates
export const toCube = (coordinates: AxialCoordinates | CubeCoordinates): CubeCoordinates => {
  return isCubeCoordinates(coordinates)
    ? coordinates
    : {
      q: coordinates.q,
      r: coordinates.r,
      s: -coordinates.q - coordinates.r,
    }
}

export const roundToNearestHex = (fractionalCoordinates: AxialCoordinates | CubeCoordinates): CubeCoordinates => {
  const cubeCoordinates = isCubeCoordinates(fractionalCoordinates)
    ? fractionalCoordinates
    : toCube(fractionalCoordinates)

  let rx = Math.round(cubeCoordinates.q)
  let ry = Math.round(cubeCoordinates.r)
  let rz = Math.round(cubeCoordinates.s)

  const xDiff = Math.abs(rx - cubeCoordinates.q)
  const yDiff = Math.abs(ry - cubeCoordinates.r)
  const zDiff = Math.abs(rz - cubeCoordinates.s)

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz
  } else if (yDiff > zDiff) {
    ry = -rx - rz
  } else {
    rz = -rx - ry
  }

  const cubeResult = {
    q: rx,
    r: ry,
    s: rz,
  }

  return cubeResult
}

/**
 * Immutable data type for working with coordinates in a hex grid.
 *
 * This class stores data as Cube Coordinates, but can be constructed from Axial coordinates as well. Coordinate
 * arithmetic and other helper functions are provided. All operations return a new HexCoordinates instance where
 * needed to maintain the immutable property for coordinates.
 *
 * For more information, see https://www.redblobgames.com/grids/hexagons/implementation.html#hex
 */
export class HexCoordinates implements AxialCoordinates, CubeCoordinates, AxialCoordinatesXY, CubeCoordinatesXYZ {
  public static getDirectionOffset (direction: HexDirection) {
    return HexCoordinates._neighborOffsets[direction]
  }

  // https://www.redblobgames.com/grids/hexagons/#neighbors-cube
  private static _neighborOffsets = [
    new HexCoordinates(1, 0, -1),
    new HexCoordinates(1, -1, 0),
    new HexCoordinates(0, -1, 1),
    new HexCoordinates(-1, 0, 1),
    new HexCoordinates(-1, 1, 0),
    new HexCoordinates(0, 1, -1),
  ]

  private _coordinates: [number, number, number]

  constructor (
    _q: number,
    _r: number,
    _s?: number
  ) {
    if (isNil(_s)) {
      _s = -_q - _r
    }

    if (_q + _r + _s !== 0) {
      throw new Error(`Invalid Hex coordinates (${_q}, ${_r}, ${_s}): component parts must add up to zero`)
    }

    this._coordinates = [_q, _r, _s]
  }

  public get q () {
    return this._coordinates[0]
  }

  public get r () {
    return this._coordinates[1]
  }

  public get s () {
    return this._coordinates[2]
  }

  public get x () {
    return this._coordinates[0]
  }

  public get y () {
    return this._coordinates[1]
  }

  public get z () {
    return this._coordinates[2]
  }

  // https://www.redblobgames.com/grids/hexagons/implementation.html#hex-arithmetic
  public add (other: AxialCoordinates | CubeCoordinates) {
    const otherAsCube = toCube(other)
    return new HexCoordinates(
      this.q + otherAsCube.q,
      this.r + otherAsCube.r,
      this.s + otherAsCube.s
    )
  }

  public subtract (other: AxialCoordinates | CubeCoordinates) {
    const otherAsCube = toCube(other)
    return new HexCoordinates(
      this.q - otherAsCube.q,
      this.r - otherAsCube.r,
      this.s - otherAsCube.s
    )
  }

  public multiply (scalar: number) {
    return new HexCoordinates(
      this.q * scalar,
      this.r * scalar,
      this.s * scalar
    )
  }

  /**
   * Rounds fractional hex coordinates to the nearest whole number value.
   */
  public round () {
    const rounded = roundToNearestHex(this)
    return new HexCoordinates(
      rounded.q,
      rounded.r,
      rounded.s
    )
  }

  /**
   * Returns the distance between this hex and the origin hex.
   * See: https://www.redblobgames.com/grids/hexagons/implementation.html#hex-distance
   */
  public length () {
    return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2
  }

  /**
   * Returns the distance from this hex to another.
   * See: https://www.redblobgames.com/grids/hexagons/implementation.html#hex-distance
   */
  public distanceTo (other: HexCoordinates) {
    return this.subtract(other).length()
  }

  // https://www.redblobgames.com/grids/hexagons/implementation.html#hex-neighbors
  public getNeighbor (direction: HexDirection) {
    return this.add(HexCoordinates.getDirectionOffset(direction))
  }
}
