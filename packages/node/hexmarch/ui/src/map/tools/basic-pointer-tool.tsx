
import React from 'react'

import {
  CoordinateConverter,
  PanAndZoom,
  PanAndZoomTool,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { AxialCoordinates } from '@thrashplay/hex-utils'
import { MapData } from '@thrashplay/hexmarch-model'

export type SelectTile = ToolEvent<'select-tile', AxialCoordinates>

export const BasicPointerTool = ({ data, ...props }: ToolProps<SelectTile | PanAndZoom, MapData>) => {
  const { layout } = data
  const { extents, onToolEvent, viewport } = props

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    onToolEvent({
      type: 'select-tile',
      payload: layout.pixelToHex(worldCoordinates),
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
