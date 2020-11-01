import React, { useCallback } from 'react'

import {
  CoordinateConverter,
  DragEvent,
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

  const handleDrag = useCallback(({
    x,
    y,
  }: DragEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld({ x, y })

    onToolEvent({
      type: 'move',
      payload: worldCoordinates,
    })
  }, [extents, onToolEvent, viewport])

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    onToolEvent({
      type: 'move',
      payload: worldCoordinates,
    })
  }

  useCanvasEvent('tap', handleTap)
  useCanvasEvent('drag', handleDrag)

  return (
    null
  )
}
