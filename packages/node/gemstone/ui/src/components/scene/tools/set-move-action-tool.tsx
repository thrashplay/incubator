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

export type SetMoveAction = ToolEvent<'set-move-action', XY>

export const SetMoveActionTool = ({ ...props }: ToolProps<SetMoveAction | PanAndZoom, unknown>) => {
  const { extents, onToolEvent, viewport } = props

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    onToolEvent({
      type: 'set-move-action',
      payload: worldCoordinates,
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
