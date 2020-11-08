import React from 'react'
import { Rect } from 'react-native-svg'

import { Wall } from '@thrashplay/gemstone-map-model'

export interface WallViewProps {
  wall: Wall
}

export const WallView = ({ wall }: WallViewProps) => {
  const { x, y, width, height } = wall.bounds

  return (
    <Rect
      fill="black"
      height={height}
      width={width}
      x={x}
      y={y}
    />
  )
}
