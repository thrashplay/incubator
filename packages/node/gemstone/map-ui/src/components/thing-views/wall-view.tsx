import { map } from 'lodash/fp'
import React from 'react'
import { Line, Rect } from 'react-native-svg'

import { Break, getThingBounds, Wall } from '@thrashplay/gemstone-map-model'
import { feetToPixels, useValue, useWorldCoordinateConverter } from '@thrashplay/gemstone-ui-core'
import { calculateLocationAlongVector } from '@thrashplay/math'

export interface WallViewProps {
  wall: Wall
}

export const WallView = ({ wall }: WallViewProps) => {
  const { extentsToCanvas, toCanvas } = useWorldCoordinateConverter()
  const bounds = useValue(getThingBounds, { thingId: wall.id })

  const getPointOnWall = calculateLocationAlongVector(wall.p1, wall.p2)

  const renderBreak = (wallBreak: Break) => {
    const p1 = toCanvas(getPointOnWall(wallBreak.position - (wallBreak.length / 2)))
    const p2 = toCanvas(getPointOnWall(wallBreak.position + (wallBreak.length / 2)))

    return (
      <Line key={wallBreak.position}
        stroke="red"
        strokeWidth={feetToPixels(wall.thickness) * 0.75}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
      />
    )
  }

  return bounds === undefined ? null : (
    <>
      <Rect key={wall.id}
        fill="#333"
        {...extentsToCanvas(bounds)}
      />
      {map(renderBreak)(wall.breaks)}
    </>
  )
}
