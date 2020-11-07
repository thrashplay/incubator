import React from 'react'
import { Circle, CircleProps } from 'react-native-svg'

import { useAnchorPoint } from './anchor'

export interface CircleDecoratorProps extends CircleProps {
  /** X Offset (in canvas coordinates) from the decorator's anchor point, defaulting to 0 */
  offsetX?: number

  /** Y Offset (in canvas coordinates) from the decorator's anchor point, defaulting to 0 */
  offsetY?: number

  /** The circle's radius (in canvas coordinates) */
  radius: number
}

export const CircleDecorator = ({
  offsetX = 0,
  offsetY = 0,
  radius,
  ...circleProps
}: CircleDecoratorProps) => {
  const { x, y } = useAnchorPoint()

  return (
    <Circle
      cx={x + offsetX}
      cy={y + offsetY}
      r={radius}
      {...circleProps}
    />
  )
}
