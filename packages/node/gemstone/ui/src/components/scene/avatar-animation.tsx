import { isEqual } from 'lodash'
import React, { useRef, useState } from 'react'
import { Animated } from 'react-native'

import { Point } from '@thrashplay/gemstone-model'

import { AvatarProps } from './default-avatar'

export interface AvatarAnimationProps extends Omit<AvatarProps, 'animatedX' | 'animatedY' | 'isAnimating'> {
  /** render function used to create Avatar elements */
  renderAvatar: (props: AvatarProps) => React.ReactNode

  /** the time offset, in seconds, of the frame currently being rendered */
  timeOffset: number
}

export const AvatarAnimation = (props: AvatarAnimationProps) => {
  const { actor, renderAvatar, timeOffset } = props

  const { position } = actor.status

  const [isAnimating, setIsAnimating] = useState(false)

  const lastPosition = useRef<undefined | Point>(undefined)
  const lastTime = useRef(0)
  const animationTarget = useRef(new Animated.ValueXY(position)).current
  const animationCurrent = useRef(new Animated.ValueXY(position)).current

  if (!isEqual(lastPosition.current, position)) {
    const MAX_ANIMATION_DURATION = 2500
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
    <>
      {renderAvatar({
        ...props,
        animatedX: animationCurrent.x,
        animatedY: animationCurrent.y,
        isAnimating,
      })}
    </>
  )
}
