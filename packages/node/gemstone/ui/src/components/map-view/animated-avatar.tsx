import { isEqual } from 'lodash'
import React, { useRef, useState } from 'react'
import { Animated } from 'react-native'

import { getPosition, getTime, Point } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { AvatarProps, DefaultAvatar } from './default-avatar'

export type AnimatedAvatarProps = Omit<AvatarProps, 'animatedX' | 'animatedY' | 'isAnimating'>

export const AnimatedAvatar = (props: AnimatedAvatarProps) => {
  const { actorId, renderAvatar } = props

  const frameQuery = useFrameQuery()
  const query = { ...frameQuery, characterId: actorId }
  const position = useValue(getPosition, query)
  const timeOffset = useValue(getTime, frameQuery)

  const [isAnimating, setIsAnimating] = useState(false)

  const lastPosition = useRef<undefined | Point>(undefined)
  const lastTime = useRef(0)
  const animationTarget = useRef(new Animated.ValueXY(position)).current
  const animationCurrent = useRef(new Animated.ValueXY(position)).current

  if (!isEqual(lastPosition.current, position)) {
    const MAX_ANIMATION_DURATION = 625
    const ANIMATION_DURATION_FACTOR = 0.05

    const timeDelta = Math.abs(timeOffset - lastTime.current)
    lastTime.current = timeOffset

    const duration = Math.abs(Math.min(MAX_ANIMATION_DURATION, (1000 * timeDelta) * ANIMATION_DURATION_FACTOR))

    Animated.timing(animationCurrent, {
      duration,
      toValue: animationTarget,
      useNativeDriver: true,
    }).start()

    animationCurrent.addListener(({ x, y }) => {
      setIsAnimating(() => x !== lastPosition.current?.x || y !== lastPosition.current?.y)
    })

    animationTarget.setValue(position)
    lastPosition.current = position
  }

  return (
    <DefaultAvatar {...props}
      animatedX={animationCurrent.x}
      animatedY={animationCurrent.y}
      isAnimating={isAnimating}
    />
  )
}
