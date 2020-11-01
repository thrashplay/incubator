import { get, map, take } from 'lodash/fp'
import React from 'react'
import { Animated } from 'react-native'
import { Circle, CircleProps, G, LineProps, Text, TextProps } from 'react-native-svg'

import {
  Actor,
  calculateDistance,
  getActor,
  getCurrentSpeed,
  getMaxDistance,
  getPosition,
  getReach,
  getSize,
  getTarget,
} from '@thrashplay/gemstone-model'

import { useFrameQuery } from '../../frame-context'
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
    fontSize: 8,
  }
  : {
    fontSize: 8,
  }

const getLineProps = (selected: boolean): LineProps => selected
  ? {
    strokeWidth: 0,
    // strokeOpacity: 0.5,
    // stroke: 'red',
  }
  : {
    strokeWidth: 0,
  }

const getFillProps = (selected: boolean): CircleProps => selected
  ? {
    fillOpacity: 0.25,
    fill: 'red',
  }
  : {
    fillOpacity: 0.25,
    fill: 'gray',
  }

const getCircleProps = (selected: boolean): CircleProps => ({
  ...getFillProps(selected),
  ...getLineProps(selected),
})

const getProjectionCircleProps = (selected: boolean): CircleProps => selected
  ? {
    fillOpacity: 0,
    stroke: 'gray',
    strokeDasharray: [1, 1],
    strokeOpacity: 0.25,
  }
  : {
    fillOpacity: 0,
    strokeOpacity: 0,
  }

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
  strokeOpacity: 0.25,
  strokeWidth: 0.5,
}
const SPARSE_DASHED_LINE = {
  stroke: 'black',
  strokeDasharray: [1, 3],
  strokeOpacity: 0.5,
  strokeWidth: 0.5,
}

const setColor = (selected: boolean) => (props: LineProps) => ({
  ...props,
  stroke: selected ? 'black' : 'black',
})

const feetToPixels = (feet: number) => feet * PIXELS_PER_FOOT

const RenderAction = ({
  actor,
  selected,
}: AvatarProps) => {
  const frameQuery = useFrameQuery()

  const { action, position } = actor.status
  const speed = useValue(getCurrentSpeed, { ...frameQuery, characterId: actor.id })
  const reach = useValue(getReach, { ...frameQuery, characterId: actor.id })
  const size = useValue(getSize, { ...frameQuery, characterId: actor.id })

  // todo this is a hack, to see something working
  const target = useValue(getActor, { characterId: get('data')(action) })

  switch (action.type) {
    case 'move': {
      const destination = get('data')(action)
      const totalDistance = calculateDistance(position, destination)

      return (
        <G>
          {selected && (
            <>
              <Circle
                cx={destination.x}
                cy={destination.y}
                r={feetToPixels(size)}
                fillOpacity={0}
                stroke="gray"
                strokeWidth={0.5}
              />
              <Circle
                cx={destination.x}
                cy={destination.y}
                r={feetToPixels(reach)}
                fillOpacity={0}
                stroke="gray"
                strokeDasharray={[1, 1]}
                strokeWidth={0.5}
              />
            </>
          )}
          {selected
            ? (
              <SegmentedVector
                breakpoints={map(feetToPixels)([size, totalDistance - size])}
                destination={destination}
                segmentStyles={map(setColor(selected))([NO_LINE, DASHED_LINE, NO_LINE])}
                start={position}
              />
            )
            : (
              <SegmentedVector
                breakpoints={map(feetToPixels)([size, totalDistance - size])}
                destination={destination}
                segmentStyles={map(setColor(selected))([NO_LINE, NO_LINE, NO_LINE])}
                start={position}
              />
            )}
        </G>
      )
    }

    case 'follow':
      return selected
        ? (
          <SegmentedVector
            breakpoints={map(feetToPixels)([reach, getMaxDistance(speed, 3)])}
            destination={target?.status.position}
            segmentStyles={map(setColor(selected))([NO_LINE, SOLID_LINE, DASHED_LINE])}
            start={position}
          />
        )
        : (
          <SegmentedVector
            breakpoints={map(feetToPixels)([reach, getMaxDistance(speed, 3)])}
            destination={target?.status.position}
            segmentStyles={map(setColor(selected))([NO_LINE, SOLID_LINE, NO_LINE])}
            start={position}
          />
        )

    default:
      return null
  }
}

const RenderTarget = ({
  actor,
  selected,
}: AvatarProps) => {
  const frameQuery = useFrameQuery()

  const position = useValue(getPosition, { ...frameQuery, characterId: actor.id })
  const reach = useValue(getReach, { ...frameQuery, characterId: actor.id })
  const target = useValue(getTarget, { ...frameQuery, characterId: actor.id })
  const targetLocation = useValue(getPosition, { ...frameQuery, characterId: target })

  return target === undefined ? null : (
    <SegmentedVector
      breakpoints={[feetToPixels(reach)]}
      destination={targetLocation}
      segmentStyles={[NO_LINE, SPARSE_DASHED_LINE]}
      start={position}
    />
  )
}

export const DefaultAvatar = (props: AvatarProps) => {
  const {
    actor,
    animatedX,
    animatedY,
    isAnimating,
    selected,
  } = props
  const frameQuery = useFrameQuery()
  const reach = useValue(getReach, { ...frameQuery, characterId: actor.id })
  const size = useValue(getSize, { ...frameQuery, characterId: actor.id })

  return (
    <G key={actor.id}>
      <AnimatedG
        x={animatedX}
        y={animatedY}
      >
        {selected && (
          <Circle
            cx={0}
            cy={0}
            r={feetToPixels(reach)}
            {...getCircleProps(selected)}
          />
        )}
        <Circle
          cx={0}
          cy={0}
          r={feetToPixels(size)}
          fillOpacity={0.25}
          fill="black"
        />
        <Text
          fontSize={8}
          textAnchor="middle"
          x={0}
          y={-size - 2}
          {...getTextProps(selected)}
        >
          {take(1)(actor.name)}
        </Text>
      </AnimatedG>
      {!isAnimating && <RenderAction {...props} />}
      {!isAnimating && <RenderTarget {...props} />}
    </G>
  )
}

const AnimatedG = Animated.createAnimatedComponent(G)
