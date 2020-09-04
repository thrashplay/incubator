import { join, map } from 'lodash'
import React from 'react'
import { Polygon } from 'react-native-svg'

import { HexCoordinates } from '@thrashplay/hex-utils'

import { SvgColor, TileRenderer, TileRendererProps } from '../types'

export interface BorderOnlyTileRendererProps extends TileRendererProps {
  borderColor?: SvgColor
  borderWidth?: number
}

export const BorderOnlyTileRenderer: TileRenderer<BorderOnlyTileRendererProps> = ({
  borderColor = 'black',
  borderWidth = 1,
  mapLayout,
  q,
  r,
}: BorderOnlyTileRendererProps) => {
  const pointObjects = mapLayout.getCorners(new HexCoordinates(q, r))
  const pointStrings = map(pointObjects, (point) => `${point.x},${point.y}`)
  const points = join(pointStrings, ' ')

  return (
    <Polygon
      points={points}
      fill="transparent"
      fillOpacity={0}
      stroke={borderColor}
      strokeWidth={borderWidth}
    />
  )
}
