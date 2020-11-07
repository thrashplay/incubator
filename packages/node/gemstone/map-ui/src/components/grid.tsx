import { range } from 'lodash'
import { map } from 'lodash/fp'
import React from 'react'
import { G, Line } from 'react-native-svg'

import { feetToPixels, pixelsToFeet } from '@thrashplay/gemstone-ui-core'

export interface GridProps {
  /** space between grid lines, in view coordinates */
  gridSpacing: number

  /** height of the map, in view coordinates */
  mapHeight: number

  /** width of the map, in view coordinates */
  mapWidth: number
}

const StyledGridLine = (props: any) => <Line
  stroke="gray"
  strokeOpacity={0.15}
  strokeWidth={0.25}
  {...props}
/>

export const Grid = ({
  gridSpacing,
  mapHeight,
  mapWidth,
}: GridProps) => {
  const createHorizontalLine = (position: number) => <StyledGridLine
    key={`h@${position}`}
    x1={feetToPixels(-mapWidth / 2)}
    x2={feetToPixels(mapWidth / 2)}
    y1={feetToPixels(position)}
    y2={feetToPixels(position)}
  />

  const createVerticalLine = (position: number) => <StyledGridLine
    key={`v@${position}`}
    x1={feetToPixels(position)}
    x2={feetToPixels(position)}
    y1={feetToPixels(-mapHeight / 2)}
    y2={feetToPixels(mapHeight / 2)}
  />

  return (
    <G>
      {map(createVerticalLine)(range(-mapWidth / 2, mapWidth / 2, gridSpacing))}
      {map(createHorizontalLine)(range(-mapHeight / 2, mapHeight / 2, gridSpacing))}
    </G>
  )
}
