import { get, map, take } from 'lodash/fp'
import React from 'react'
import { Animated } from 'react-native'
import { Circle, CircleProps, G, LineProps, Text, TextProps } from 'react-native-svg'

import { createAction } from '@thrashplay/gemstone-engine'
import {
  Actor,
  getAction,
  getPosition,
  getPublicCharacterName,
  getReach,
  getSize,
  getTarget,
} from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'
import { calculateDistance } from '@thrashplay/math'

import { SegmentedVector } from './segmented-vector'

const PIXELS_PER_FOOT = 1

export interface AvatarProps {
  actorId: Actor['id']
  animatedX: Animated.Value
  animatedY: Animated.Value
  highlighted?: boolean
  isAnimating: boolean
  selected?: boolean
}

const getTextProps = (selected: boolean): TextProps => selected
  ? {
    fontSize: 8,
  }
  : {
    fontSize: 8,
  }

const NO_LINE = {
  strokeWidth: 0,
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

const setColor = (color: string) => (props: LineProps) => ({
  ...props,
  stroke: color,
})

const feetToPixels = (feet: number) => feet * PIXELS_PER_FOOT

const RenderAction = ({
  actorId,
  selected,
}: AvatarProps) => {
  const frameQuery = useFrameQuery()
  const query = { ...frameQuery, characterId: actorId }

  const action = useValue(getAction, query) ?? createAction('idle')
  const position = useValue(getPosition, query)
  const reach = useValue(getReach, query)
  const size = useValue(getSize, query)

  // todo this is a hack, to see something working
  const targetId = get('data.target')(action)
  const targetPosition = useValue(getPosition, { ...frameQuery, characterId: targetId })
  const targetSize = useValue(getSize, { ...frameQuery, characterId: targetId })

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
                segmentStyles={map(setColor('black'))([NO_LINE, DASHED_LINE, NO_LINE])}
                start={position}
              />
            )
            : (
              <SegmentedVector
                breakpoints={map(feetToPixels)([size, totalDistance - size])}
                destination={destination}
                segmentStyles={map(setColor('black'))([NO_LINE, NO_LINE, NO_LINE])}
                start={position}
              />
            )}
        </G>
      )
    }

    case 'attack': {
      const totalDistance = calculateDistance(position, targetPosition)

      return (
        <G>
          {/* {selected && (
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
          )} */}
          {(
            <SegmentedVector
              breakpoints={map(feetToPixels)([size, totalDistance - targetSize])}
              destination={targetPosition}
              segmentStyles={map(setColor('red'))([NO_LINE, DASHED_LINE, NO_LINE])}
              start={position}
            />
          )}
        </G>
      )
    }

    default:
      return null
  }
}

const RenderTarget = ({
  actorId,
}: AvatarProps) => {
  const frameQuery = useFrameQuery()
  const query = { ...frameQuery, characterId: actorId }

  const position = useValue(getPosition, query)
  const reach = useValue(getReach, query)
  const target = useValue(getTarget, query)
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
    actorId,
    animatedX,
    animatedY,
    highlighted,
    isAnimating,
    selected = false,
  } = props
  const frameQuery = useFrameQuery()
  const query = { ...frameQuery, characterId: actorId }
  const reach = useValue(getReach, query)
  const size = useValue(getSize, query)
  const name = useValue(getPublicCharacterName, query)

  const getStyles = (type: string) => {
    const specialStyles = selected
      ? SelectedStyles
      : highlighted ? HighlightedStyles : {}

    return {
      ...(get(type)(DefaultStyles) ?? {}),
      ...(get(type)(specialStyles) ?? {}),
    }
  }

  return (
    <G key={actorId}>
      <AnimatedG
        x={animatedX}
        y={animatedY}
      >
        <Circle
          cx={0}
          cy={0}
          r={feetToPixels(reach)}
          {...getStyles('reachCircle')}
        />
        <Circle
          cx={0}
          cy={0}
          r={feetToPixels(size)}
          {...getStyles('bodyCircle')}
        />
        <Text
          fontSize={8}
          textAnchor="middle"
          x={0}
          y={-size - 2}
          {...getTextProps(selected)}
        >
          {take(1)(name)}
        </Text>
      </AnimatedG>
      {!isAnimating && <RenderAction {...props} />}
      {!isAnimating && <RenderTarget {...props} />}
    </G>
  )
}

const AnimatedG = Animated.createAnimatedComponent(G)

const DefaultStyles: { [k in string]?: CircleProps } = {
  bodyCircle: {
    fillOpacity: 0.25,
    fill: 'black',
    strokeWidth: 0,
  },
  reachCircle: {
    strokeWidth: 0,
    fillOpacity: 0.25,
    fill: 'gray',
  },
}

const HighlightedStyles: { [k in string]?: CircleProps } = {
  bodyCircle: {
    fill: 'yellow',
    fillOpacity: 0.8,
    strokeWidth: 0.5,
    stroke: 'gray',
  },
}

const SelectedStyles: { [k in string]?: CircleProps } = {
  reachCircle: {
    fillOpacity: 0.25,
    fill: 'red',
  },
}
