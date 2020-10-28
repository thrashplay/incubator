import { useCallback } from 'react'

import { calculateScale } from './coordinate-helpers'
import { Dimensions, DragEvent, Extents, ToolEvent, ToolProps, XY, ZoomEvent } from './types'
import { useCanvasEvent } from './use-canvas-event'

export type PanAndZoom = ToolEvent<'canvas/pan-and-zoom', { extents: Extents }>

const calculateExtents = (pan: XY, scaleFactor: number, viewport: Dimensions): Extents => {
  // const matrix = inverse(compose(
  //   translate(pan.x, pan.y),
  //   scale(scaleFactor)
  // ))

  // const upperLeft = applyToPoint(matrix, { x: 0, y: 0 })
  // const lowerRight = applyToPoint(matrix, { x: viewport.width, y: viewport.height })

  // return {
  //   ...upperLeft,
  //   width: lowerRight.x - upperLeft.x,
  //   height: lowerRight.y - upperLeft.y,
  // }

  // throw new Error('dioed')

  const extents = {
    x: -pan.x / scaleFactor,
    y: -pan.y / scaleFactor,
    width: viewport.width * (1 / scaleFactor),
    height: viewport.height * (1 / scaleFactor),
  }

  return extents
}

export const PanAndZoomTool = ({ onToolEvent }: ToolProps<PanAndZoom>) => {
  const handleDrag = useCallback(({
    dx,
    dy,
    extents,
    viewport,
  }: DragEvent) => {
    const scale = calculateScale(extents, viewport)

    onToolEvent({
      type: 'canvas/pan-and-zoom',
      payload: {
        extents: {
          ...extents,
          x: extents.x - dx / scale,
          y: extents.y - dy / scale,
        },
      },
    })
  }, [onToolEvent])

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

    onToolEvent({
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
  }, [onToolEvent])

  useCanvasEvent('drag', handleDrag)
  useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
