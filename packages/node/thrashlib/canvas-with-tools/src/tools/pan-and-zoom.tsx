import { useCallback } from 'react'

import { DragEvent, ZoomEvent } from '../canvas-events'
import { calculateScale } from '../coordinate-helpers'
import { useCanvasEvent } from '../hooks/use-canvas-event'

import { ExtentsControllerProps } from './extents-controller-props'

export const PanAndZoomTool = ({ onExtentsChanged }: ExtentsControllerProps) => {
  const handleDrag = useCallback(({
    dx,
    dy,
    extents,
    viewport,
  }: DragEvent) => {
    const scale = calculateScale(extents, viewport)
    onExtentsChanged({
      ...extents,
      x: extents.x - dx / scale,
      y: extents.y - dy / scale,
    })
  }, [onExtentsChanged])

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

  useCanvasEvent('drag', handleDrag)
  useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
