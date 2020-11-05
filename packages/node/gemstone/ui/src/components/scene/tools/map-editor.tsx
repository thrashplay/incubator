import React from 'react'

import {
  CoordinateConverter,
  PanAndZoomEvent,
  PanAndZoomTool,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { Area, getAreaAtPosition } from '@thrashplay/gemstone-map-model'
import { useSelector } from '@thrashplay/gemstone-ui-core'

import { SceneMapData } from '../scene-map'

export type SelectMapAreaEvent = ToolEvent<'select-map-area', Area['id'] | undefined>

export const MapEditorTool = (
  { data, ...props }: ToolProps<PanAndZoomEvent | SelectMapAreaEvent, SceneMapData>
) => {
  const { extents, toolEventDispatch, viewport } = props

  const pickArea = useSelector(getAreaAtPosition)

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    const area = pickArea({ position: worldCoordinates })
    toolEventDispatch({
      type: 'select-map-area',
      payload: area?.id,
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
