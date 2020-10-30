import { get, map, take } from 'lodash/fp'
import React from 'react'
import { Animated } from 'react-native'
import { Circle, CircleProps, G, LineProps, Text, TextProps } from 'react-native-svg'

import { getMaxDistance } from '@thrashplay/gemstone-engine'
import { Actor, getActor } from '@thrashplay/gemstone-model'

import { useValue } from '../../store'

import { SegmentedVector } from './segmented-vector'

const PIXELS_PER_FOOT = 1

export interface AvatarProps {
  actor: Actor
  animatedX: Animated.Value
  animatedY: Animated.Value
  isAnimating: boolean
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

const RenderIntention = ({
  actor,
  selected,
}: AvatarProps) => {
  const { intention, position } = actor.status
  const speed = actor.speed ?? 0

  // todo this is a hack, to see something working
  const target = useValue(getActor, { characterId: get('data')(intention) })

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

    case 'follow':
      return selected
        ? (
          <SegmentedVector
            breakpoints={map(feetToPixels)([10, getMaxDistance(speed, 3)])}
            destination={target?.status.position}
            segmentStyles={map(setColor(selected))([NO_LINE, SOLID_LINE, DASHED_LINE])}
            start={position}
          />
        )
        : (
          <SegmentedVector
            breakpoints={map(feetToPixels)([10, getMaxDistance(speed, 3)])}
            destination={target?.status.position}
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
    animatedX,
    animatedY,
    isAnimating,
    selected,
  } = props
  return (
    <G key={actor.id}>
      <AnimatedG
        x={animatedX}
        y={animatedY}
      >
        <Text
          fontSize={8}
          textAnchor="middle"
          x={0}
          y={3}
          {...getTextProps(selected)}
        >
          {take(1)(actor.name)}
        </Text>
        <Circle
          cx={0}
          cy={0}
          r={feetToPixels(10)}
          {...getCircleProps(selected)}
        />
      </AnimatedG>
      {!isAnimating && <RenderIntention {...props} />}
    </G>
  )
}

const AnimatedG = Animated.createAnimatedComponent(G)
