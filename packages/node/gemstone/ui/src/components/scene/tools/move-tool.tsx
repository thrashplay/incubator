import React from 'react'

import {
  CoordinateConverter,
  PanAndZoom,
  PanAndZoomTool,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
  XY,
} from '@thrashplay/canvas-with-tools'

export type Move = ToolEvent<'move', XY>

export const MoveTool = ({ ...props }: ToolProps<Move | PanAndZoom, unknown>) => {
  const { extents, onToolEvent, viewport } = props

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    onToolEvent({
      type: 'move',
      payload: worldCoordinates,
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
