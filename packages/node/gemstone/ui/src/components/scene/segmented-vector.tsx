import _ from 'lodash'
import { filter, flow, last, map, size, tail } from 'lodash/fp'
import React from 'react'
import { G, Line, LineProps } from 'react-native-svg'

import { Point } from '@thrashplay/gemstone-model'

// segment style to use if we are given an empty array
const DEFAULT_SEGMENT_STYLE = {
  strokeWidth: 1,
  stroke: 'black',
}

export interface SegmentedVectorProps {
  /** distance breakpoints, in world units, at which the render style transitions */
  breakpoints?: number[]

  /** the destination for the movement */
  destination: Point

  /** styles to apply to the segments defined by the breakpoints property */
  segmentStyles?: LineProps[]

  /** the start point for the movement */
  start: Point
}

const calculateLocationAlongVector = (start: Point, destination: Point) => (distance: number) => {
  const totalDistance = Math.sqrt(
    (destination.y - start.y) * (destination.y - start.y) +
    (destination.x - start.x) * (destination.x - start.x)
  )

  return {
    x: ((destination.x - start.x) * (distance / totalDistance)) + start.x,
    y: ((destination.y - start.y) * (distance / totalDistance)) + start.y,
  }
}

const lessThanOrEq = (limit: number) => (value: number) => value <= limit

export const SegmentedVector = ({
  breakpoints = [],
  destination,
  segmentStyles = [DEFAULT_SEGMENT_STYLE],
  start,
}: SegmentedVectorProps) => {
  const maxDistance = Math.sqrt(
    (destination.y - start.y) * (destination.y - start.y) +
    (destination.x - start.x) * (destination.x - start.x)
  )

  const breakpointLocations = [
    start,
    ...flow(
      filter(lessThanOrEq(maxDistance)),
      map(calculateLocationAlongVector(start, destination))
    )(breakpoints),
    destination,
  ]

  const getSegmentStyle = (i: number) => i > size(segmentStyles)
    ? last(segmentStyles) ?? DEFAULT_SEGMENT_STYLE
    : segmentStyles[i]

  const createLine = (end: Point, index: number) => {
    // since we use the tail, the index is one less than in our source array
    const start = breakpointLocations[index]

    return (
      <Line
        {...getSegmentStyle(index)}
        key={index}
        x1={start.x}
        x2={end.x}
        y1={start.y}
        y2={end.y}
      />
    )
  }

  return (
    <G>
      {_.map(tail(breakpointLocations), createLine)}
    </G>
  )
}
