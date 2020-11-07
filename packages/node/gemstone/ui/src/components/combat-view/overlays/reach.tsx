import { get } from 'lodash/fp'
import React from 'react'
import { Animated } from 'react-native'
import { Circle, CircleProps, G } from 'react-native-svg'

import { getReach } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { AvatarProps } from '../../map-view/default-avatar'

const PIXELS_PER_FOOT = 1

const feetToPixels = (feet: number) => feet * PIXELS_PER_FOOT

export const ReachOverlay = (props: AvatarProps) => {
  const {
    actorId,
    animatedX,
    animatedY,
    highlighted,
    selected = false,
  } = props
  const frameQuery = useFrameQuery()
  const query = { ...frameQuery, characterId: actorId }
  const reach = useValue(getReach, query)

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
      </AnimatedG>
    </G>
  )
}

const AnimatedG = Animated.createAnimatedComponent(G)

const DefaultStyles: { [k in string]?: CircleProps } = {
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
