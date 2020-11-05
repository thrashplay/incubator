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
import { Area, getArea, getAreaAtPosition } from '@thrashplay/gemstone-map-model'
import { AreaShape } from '@thrashplay/gemstone-map-ui'
import { useSelector, useValue } from '@thrashplay/gemstone-ui-core'

import { SceneMapData } from '../scene-map'

export type SelectMapAreaEvent = ToolEvent<'select-map-area', Area['id'] | undefined>

export const MapEditorTool = (
  { data, ...props }: ToolProps<PanAndZoomEvent | SelectMapAreaEvent, SceneMapData>
) => {
  const { extents, toolEventDispatch, viewport } = props
  const { selectedMapArea: selectedMapAreaId } = data
  console.log('a', selectedMapAreaId)

  const pickArea = useSelector(getAreaAtPosition)
  const selectedMapArea = useValue(getArea, { areaId: selectedMapAreaId })

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
  console.log('b', selectedMapArea)

  return (
    <>
      <PanAndZoomTool {...props} />
      {selectedMapArea && (
        <AreaShape
          area={selectedMapArea}
          stroke="red"
          strokeOpacity={1}
          strokeWidth={2}
        />
      )}
    </>
  )
}
