import { join, map } from 'lodash'
import React from 'react'
import { Polygon } from 'react-native-svg'

import { HexCoordinates } from '@thrashplay/hex-utils'

import { SvgColor, TileRenderer, TileRendererProps } from '../types'

export interface FlatColorTileRendererProps extends TileRendererProps {
  borderColor?: SvgColor
  borderWidth?: number
  fillColor?: SvgColor
}

export const FlatColorTileRenderer: TileRenderer<FlatColorTileRendererProps> = ({
  borderColor = 'black',
  borderWidth = 1,
  fillColor = 'gray',
  mapLayout,
  q,
  r,
}: FlatColorTileRendererProps) => {
  const pointObjects = mapLayout.getCorners(new HexCoordinates(q, r))
  const pointStrings = map(pointObjects, (point) => `${point.x},${point.y}`)
  const points = join(pointStrings, ' ')

  return (
    <Polygon
      points={points}
      fill={fillColor}
      stroke={borderColor}
      strokeWidth={borderWidth}
    />
  )
}
