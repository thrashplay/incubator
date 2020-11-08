import React from 'react'
import { CommonPathProps, Rect } from 'react-native-svg'

import { Area, getAreaBounds } from '@thrashplay/gemstone-map-model'
import { useValue, useWorldCoordinateConverter } from '@thrashplay/gemstone-ui-core'

import { MapAreaDecoratorFunction } from './types'

export interface AreaShapeProps extends Omit<CommonPathProps, 'x' | 'y'> {
  /** The ID of the area whose shape to render */
  areaId: Area['id']
}

/**
 * Creates an AreaShape decorator with the specified common path props.
 */
export const createAreaShape = (pathProps: Omit<CommonPathProps, 'x' | 'y'>): MapAreaDecoratorFunction =>
  // eslint-disable-next-line react/display-name
  ({ areaId }: AreaShapeProps) => <AreaShape {...pathProps} areaId={areaId} />

/**
 * Renders the shape of a map Area (i.e. room, hallway, etc)
 * Rendering can be customized using any of the SVG common path props.
 **/
export const AreaShape = ({ areaId, ...pathProps }: AreaShapeProps) => {
  const { extentsToCanvas } = useWorldCoordinateConverter()
  const bounds = useValue(getAreaBounds, { areaId })

  const canvasBounds = extentsToCanvas(bounds)

  return (
    <Rect
      {...pathProps}
      x={canvasBounds.x}
      y={canvasBounds.y}
      width={canvasBounds.width}
      height={canvasBounds.height}
    />
  )
}

export const AreaShapes = {
  Default: createAreaShape({
    fill: 'white',
  }),
}
