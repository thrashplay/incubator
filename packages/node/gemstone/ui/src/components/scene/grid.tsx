import { range } from 'lodash'
import { map } from 'lodash/fp'
import React from 'react'
import { G, Line } from 'react-native-svg'

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
    x1={0}
    x2={mapWidth}
    y1={position}
    y2={position}
  />

  const createVerticalLine = (position: number) => <StyledGridLine
    key={`v@${position}`}
    x1={position}
    x2={position}
    y1={0}
    y2={mapHeight}
  />

  return (
    <G>
      {map(createVerticalLine)(range(0, mapWidth, gridSpacing))}
      {map(createHorizontalLine)(range(0, mapHeight, gridSpacing))}
    </G>
  )
}
