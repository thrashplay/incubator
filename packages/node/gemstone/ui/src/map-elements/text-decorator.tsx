import React from 'react'
import { Text, TextProps } from 'react-native-svg'

import { useAnchorPoint } from './anchor'

export interface TextDecoratorProps extends TextProps {
  /** X Offset (in canvas coordinates) from the decorator's anchor point, defaulting to 0 */
  offsetX?: number

  /** Y Offset (in canvas coordinates) from the decorator's anchor point, defaulting to 0 */
  offsetY?: number

  /** the text to render */
  text: string
}

export const TextDecorator = ({
  offsetX = 0,
  offsetY = 0,
  text,
  ...textProps
}: TextDecoratorProps) => {
  const { x, y } = useAnchorPoint()

  return (
    <Text
      fontSize={18}
      textAnchor="middle"
      {...textProps}
      x={x + offsetX}
      y={y + offsetY}
    >
      {text}
    </Text>
  )
}
