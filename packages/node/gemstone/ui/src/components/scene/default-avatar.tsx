import { get, map, take } from 'lodash/fp'
import React from 'react'
import { Circle, CircleProps, G, LineProps, Text, TextProps } from 'react-native-svg'

import { Actor, getMaxDistance } from '@thrashplay/gemstone-engine'

import { SegmentedVector } from './segmented-vector'

const PIXELS_PER_FOOT = 1

export interface AvatarProps {
  actor: Actor
  selected: boolean
  x: number
  y: number
}

const getTextProps = (selected: boolean): TextProps => selected
  ? {
    fill: 'red',
    stroke: 'red',
  }
  : {
    fill: 'black',
    stroke: 'black',
  }

const getLineProps = (selected: boolean): LineProps => selected
  ? {
    fillOpacity: 0,
    strokeWidth: 2,
    stroke: 'red',
  }
  : {
    fillOpacity: 0,
    strokeWidth: 1,
    stroke: 'gray',
  }

const getCircleProps = (selected: boolean): CircleProps => getLineProps(selected)

const NO_LINE = {
  strokeWidth: 0,
}
const SOLID_LINE = {
  stroke: 'black',
  strokeWidth: 1,
}
const DASHED_LINE = {
  stroke: 'gray',
  strokeDasharray: [1, 1],
  strokeOpacity: 0.5,
  strokeWidth: 0.5,
}

const setColor = (selected: boolean) => (props: LineProps) => ({
  ...props,
  stroke: selected ? 'red' : 'black',
})

const feetToPixels = (feet: number) => feet * PIXELS_PER_FOOT

const renderIntention = ({
  actor,
  selected,
}: AvatarProps) => {
  const { intention, position } = actor.status
  const speed = actor.speed ?? 0

  switch (intention.type) {
    case 'move':
      return selected
        ? (
          <SegmentedVector
            breakpoints={map(feetToPixels)([10, getMaxDistance(speed, 3)])}
            destination={get('data')(intention)}
            segmentStyles={map(setColor(selected))([NO_LINE, SOLID_LINE, DASHED_LINE])}
            start={position}
          />
        )
        : (
          <SegmentedVector
            breakpoints={map(feetToPixels)([10, getMaxDistance(speed, 3)])}
            destination={get('data')(intention)}
            segmentStyles={map(setColor(selected))([NO_LINE, SOLID_LINE, NO_LINE])}
            start={position}
          />
        )

    default:
      return null
  }
}

export const DefaultAvatar = (props: AvatarProps) => {
  const {
    actor,
    selected,
  } = props

  const { position } = actor.status

  return (
    <G key={actor.id}>
      <Text
        fontSize={8}
        textAnchor="middle"
        x={position.x}
        y={position.y + 3}
        {...getTextProps(selected)}
      >
        {take(1)(actor.name)}
      </Text>
      <Circle
        cx={position.x}
        cy={position.y}
        r={feetToPixels(10)}
        {...getCircleProps(selected)}
      />
      {renderIntention(props)}
    </G>
  )
}
