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

export type SetMoveIntention = ToolEvent<'set-move-intention', XY>

export const SetMoveIntentionTool = ({ ...props }: ToolProps<SetMoveIntention | PanAndZoom, unknown>) => {
  const { extents, onToolEvent, viewport } = props

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    onToolEvent({
      type: 'set-move-intention',
      payload: worldCoordinates,
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
