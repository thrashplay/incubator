import {
  CoordinateConverter,
  TapEvent,
  useCanvasEvent,
  useViewport,
} from '@thrashplay/canvas-with-tools'
import { getAreaAtPosition } from '@thrashplay/gemstone-map-model'
import { useCanvasCoordinateConverter, useSelector } from '@thrashplay/gemstone-ui-core'

import { ToolProps } from '../../dispatch-view-event'
import { MapEditorViewEvent, MapEditorViewEvents } from '../events'
import { MapEditorViewState } from '../state'

export const SelectTool = ({
  dispatchViewEvent,
}: ToolProps<MapEditorViewState, MapEditorViewEvent>
) => {
  const { toWorld } = useCanvasCoordinateConverter()

  const pickArea = useSelector(getAreaAtPosition)

  const handleTap = (coordinates: TapEvent) => {
    const worldCoordinates = toWorld(coordinates)
    const area = pickArea({ position: worldCoordinates })
    dispatchViewEvent(MapEditorViewEvents.areaSelected(area?.id))
  }

  useCanvasEvent('tap', handleTap)

  return (
    null
  )
}
