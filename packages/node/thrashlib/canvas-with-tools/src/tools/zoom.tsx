import { useCallback } from 'react'

import { ZoomEvent } from '../canvas-events'
import { useCanvasEvent } from '../hooks/use-canvas-event'

import { ExtentsControllerProps } from './extents-controller-props'

export const ZoomTool = ({ onExtentsChanged }: ExtentsControllerProps) => {
// https://stackoverflow.com/a/30992764/517254
  const handleZoom = useCallback(({
    extents,
    viewport,
    x,
    y,
    zoomFactor,
  }: ZoomEvent) => {
    const newWidth = extents.width / zoomFactor
    const newHeight = extents.height / zoomFactor
    const xGrow = newWidth - extents.width
    const yGrow = newHeight - extents.height
    const xRatio = x / viewport.width
    const yRatio = y / viewport.height

    onExtentsChanged({
      x: extents.x - (xGrow * xRatio),
      y: extents.y - (yGrow * yRatio),
      width: newWidth,
      height: newHeight,
    })
  }, [onExtentsChanged])

  useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
