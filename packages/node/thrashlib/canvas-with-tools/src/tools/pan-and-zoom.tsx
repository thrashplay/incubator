import { useCallback } from 'react'

import { Extents } from '@thrashplay/geometry'

import { DragEvent, ZoomEvent } from '../canvas-events'
import { calculateScale } from '../coordinate-helpers'
import { ToolProps } from '../tool-component'
import { ToolEvent } from '../tool-events'
import { useCanvasEvent } from '../use-canvas-event'

export type PanAndZoomEvent = ToolEvent<'canvas/pan-and-zoom', { extents: Extents }>

export type PanAndZoomToolProps = ToolProps<PanAndZoomEvent> & {
  /** if true, the pan function is disabled */
  disablePan?: boolean

  /** if true, the zoom function is disabled */
  disableZoom?: boolean
}

export const PanAndZoomTool = ({
  disablePan = false,
  disableZoom = false,
  toolEventDispatch,
}: PanAndZoomToolProps) => {
  const handleDrag = useCallback(({
    dx,
    dy,
    extents,
    viewport,
  }: DragEvent) => {
    const scale = calculateScale(extents, viewport)

    if (!disablePan) {
      toolEventDispatch({
        type: 'canvas/pan-and-zoom',
        payload: {
          extents: {
            ...extents,
            x: extents.x - dx / scale,
            y: extents.y - dy / scale,
          },
        },
      })
    }
  }, [disablePan, toolEventDispatch])

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

    if (!disableZoom) {
      toolEventDispatch({
        type: 'canvas/pan-and-zoom',
        payload: {
          extents: {
            x: extents.x - (xGrow * xRatio),
            y: extents.y - (yGrow * yRatio),
            width: newWidth,
            height: newHeight,
          },
        },
      })
    }
  }, [disableZoom, toolEventDispatch])

  useCanvasEvent('drag', handleDrag)
  useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
