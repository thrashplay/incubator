import { useCallback } from 'react'

import { DragEvent, ToolEvent, ToolProps, XY, ZoomEvent } from '../types'
import { useCanvasEvent } from '../use-canvas-event'

export interface PanAndZoomValues {
  pan: XY
  scale: number
}

export type PanAndZoom = ToolEvent<'pan-and-zoom', PanAndZoomValues>

export const PanAndZoomTool = ({
  onToolEvent,
  pan,
  scale,
}: ToolProps<PanAndZoom>) => {
  const handleDrag = useCallback((event: DragEvent) => {
    onToolEvent({
      type: 'pan-and-zoom',
      payload: {
        pan: {
          x: pan.x + event.dx,
          y: pan.y + event.dy,
        },
        scale,
      },
    })
  }, [onToolEvent, pan, scale])

  // https://stackoverflow.com/a/30992764/517254
  const handleZoom = useCallback(({ x, y, zoomFactor: zoomDelta }: ZoomEvent) => {
    onToolEvent({
      type: 'pan-and-zoom',
      payload: {
        pan: {
          x: x - ((x - pan.x) * (scale * zoomDelta) / scale),
          y: y - ((y - pan.y) * (scale * zoomDelta) / scale),
        },
        scale: scale * zoomDelta,
      },
    })
  }, [onToolEvent, pan, scale])

  useCanvasEvent('drag', handleDrag)
  useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
