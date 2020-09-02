import { isArray } from 'lodash'
import { applyToPoint, compose, fromObject, inverse, Matrix, Point, scale, translate } from 'transformation-matrix'

import { AxialCoordinates, AxialCoordinatesXY, HexCoordinates, isAxialCoordinatesXY } from './coordinates'
import { createMetrics, HexMetrics } from './metrics'
import { HexOrientationType } from './types'

// https://www.redblobgames.com/grids/hexagons/implementation.html#layout
export interface HexOrientation {
  hexToPixelTransform: Matrix
  pixelToHexTransform: Matrix
  /** given in fractional multiples 60 degrees */
  startAngle: number
  type: HexOrientationType
}

// See: https://www.redblobgames.com/grids/hexagons/#hex-to-pixel-axial
const flatHexToPixelValues = {
  a: 3 / 2,
  b: Math.sqrt(3) / 2,
  c: 0,
  d: Math.sqrt(3),
  e: 0,
  f: 1,
}
const pointyHexToPixelValues = {
  a: Math.sqrt(3),
  b: 0,
  c: Math.sqrt(3) / 2,
  d: 3 / 2,
  e: 0,
  f: 1,
}

export const HexOrientations: { [k in HexOrientationType]: HexOrientation } = {
  Flat: {
    hexToPixelTransform: fromObject(flatHexToPixelValues),
    pixelToHexTransform: inverse(fromObject(flatHexToPixelValues)),
    startAngle: 0,
    type: 'Flat',
  },
  Pointy: {
    hexToPixelTransform: fromObject(pointyHexToPixelValues),
    pixelToHexTransform: inverse(fromObject(pointyHexToPixelValues)),
    startAngle: 0.5,
    type: 'Pointy',
  },
}

export class HexLayout {
  public static createFromSideLength (
    sideLength: number,
    orientation: HexOrientationType = 'Flat',
    origin: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    return new HexLayout(HexOrientations[orientation], sideLength, origin)
  }

  public static createFromWidth (
    width: number,
    orientation: HexOrientationType = 'Flat',
    origin: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    const sideLength = orientation === 'Flat' ? width / 2 : width / Math.sqrt(3)
    return HexLayout.createFromSideLength(sideLength, orientation, origin)
  }

  public static createFromHeight (
    height: number,
    orientation: HexOrientationType = 'Flat',
    origin: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    const sideLength = orientation === 'Flat' ? height / Math.sqrt(3) : height / 2
    return HexLayout.createFromSideLength(sideLength, orientation, origin)
  }

  /**
   * The 'apothem' is similar to a radius for regular polygons. It is the distance from the polygon's
   * center to the midpoint of its edge segments.
   */
  public static createFromApothem (
    apothem: number,
    orientation: HexOrientationType = 'Flat',
    origin: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    const sideLength = (apothem * 2) / Math.sqrt(3)
    return HexLayout.createFromSideLength(sideLength, orientation, origin)
  }

  private _hexToPixelTransform: Matrix
  private _metrics: HexMetrics
  private _orientation: HexOrientation
  private _origin: { x: number; y: number }
  private _pixelToHexTransform: Matrix
  private _size: { width: number; height: number }

  constructor (
    orientation: HexOrientation,
    sideLength: number,
    origin: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    this._orientation = orientation
    this._size = { width: sideLength, height: sideLength }
    this._origin = origin

    this._hexToPixelTransform = compose(
      this._orientation.hexToPixelTransform,
      scale(this._size.width, this._size.height),
      translate(this._origin.x, this._origin.y)
    )

    this._pixelToHexTransform = inverse(this._hexToPixelTransform)
    this._metrics = createMetrics(this._orientation.type, this._size.width)
  }

  public get metrics () {
    return this._metrics
  }

  // https://www.redblobgames.com/grids/hexagons/implementation.html#hex-to-pixel
  public hexToPixel (hex: AxialCoordinates | AxialCoordinatesXY) {
    return applyToPoint(this._hexToPixelTransform, isAxialCoordinatesXY(hex) ? hex : {
      x: hex.q,
      y: hex.r,
    })
  }

  // https://www.redblobgames.com/grids/hexagons/implementation.html#pixel-to-hex
  public pixelToHex (p: Point) {
    const point = applyToPoint(this._pixelToHexTransform, p)
    const q = isArray(point) ? point[0] : point.x
    const r = isArray(point) ? point[1] : point.y

    return new HexCoordinates(q, r).round()
  }

  // https://www.redblobgames.com/grids/hexagons/implementation.html#hex-geometry
  public getCorners (hex: HexCoordinates) {
    const center = this.hexToPixel(hex)

    const result = [] as PointObjectNotation[]
    for (let corner = 0; corner < 6; corner++) {
      const angle = 2.0 * Math.PI * (this._orientation.startAngle + corner) / 6
      const offsetX = this._size.width * Math.cos(angle)
      const offsetY = this._size.height * Math.sin(angle)

      result.push({
        x: center.x + offsetX,
        y: center.y + offsetY,
      })
    }

    return result
  }
}
