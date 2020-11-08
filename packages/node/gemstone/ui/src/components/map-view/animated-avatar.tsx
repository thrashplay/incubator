import { castArray, isEqual, map } from 'lodash/fp'
import React, { useCallback, useRef, useState } from 'react'
import { Animated } from 'react-native'

import { ActorDecoratorFunction } from '@thrashplay/gemstone-map-ui'
import { Actor, getPosition, getTime, Point } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue, useWorldCoordinateConverter } from '@thrashplay/gemstone-ui-core'

import { AnimatedAnchor } from '../../map-elements/anchor'

export interface AnimatedAvatarProps {
  actorId: Actor['id']
  children?: ActorDecoratorFunction | ActorDecoratorFunction[]
}

export const AnimatedAvatar = ({ actorId, children }: AnimatedAvatarProps) => {
  const { toCanvas } = useWorldCoordinateConverter()

  const frameQuery = useFrameQuery()
  const query = { ...frameQuery, characterId: actorId }
  const worldPosition = useValue(getPosition, query)
  const canvasPosition = toCanvas(worldPosition)
  const timeOffset = useValue(getTime, frameQuery)

  const [isAnimating, setIsAnimating] = useState(false)

  const lastPosition = useRef<undefined | Point>(undefined)
  const lastTime = useRef(0)
  const animationTarget = useRef(new Animated.ValueXY(canvasPosition)).current
  const animationCurrent = useRef(new Animated.ValueXY(canvasPosition)).current

  const renderDecorator = useCallback((decorator: ActorDecoratorFunction) => {
    return decorator({ actorId })
  }, [actorId])

  if (!isEqual(lastPosition.current, canvasPosition)) {
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

    animationTarget.setValue(canvasPosition)
    lastPosition.current = canvasPosition
  }

  return (
    <>
      <AnimatedAnchor x={animationCurrent.x} y={animationCurrent.y}>
        {children && map(renderDecorator)(castArray(children))}
      </AnimatedAnchor>
    </>
  )
}
