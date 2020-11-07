import React from 'react'
import { CommonPathProps, Rect } from 'react-native-svg'

import { Area } from '@thrashplay/gemstone-map-model'
import { feetToPixels } from '@thrashplay/gemstone-ui-core'

export interface AreaShapeProps extends Omit<CommonPathProps, 'x' | 'y'> {
  /** The area whose shape to render */
  area: Area
}

/**
 * Renders the shape of a map Area (i.e. room, hallway, etc)
 * Rendering can be customized using any of the SVG common path props.
 **/
export const AreaShape = ({ area, ...rest }: AreaShapeProps) => {
  const { bounds } = area
  return (
    <Rect
      {...rest}
      x={feetToPixels(bounds.x)}
      y={feetToPixels(bounds.y)}
      width={feetToPixels(bounds.width)}
      height={feetToPixels(bounds.height)}
    />
  )
}
