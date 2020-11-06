import { useCallback } from 'react'

import { DragEvent } from '../canvas-events'
import { calculateScale } from '../coordinate-helpers'
import { useCanvasEvent } from '../hooks/use-canvas-event'

import { ExtentsControllerProps } from './extents-controller-props'

export const PanTool = ({ onExtentsChanged }: ExtentsControllerProps) => {
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

  useCanvasEvent('drag', handleDrag)

  return (
    null
  )
}
