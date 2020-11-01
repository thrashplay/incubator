import { useFrameQuery } from 'gemstone/ui/src/frame-context'
import { useValue } from 'gemstone/ui/src/store'
import { filter, flow, get, head, map, matches, reject, sortBy } from 'lodash/fp'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import {
  CoordinateConverter,
  PanAndZoom,
  PanAndZoomTool,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { calculateDistance } from '@thrashplay/gemstone-engine'
import { Actor, CharacterId, getActors, Point, SceneEvents } from '@thrashplay/gemstone-model'

export type SetTarget = ToolEvent<'set-target', CharacterId | undefined>

export const SetTargetTool = ({ ...props }: ToolProps<SetTarget | PanAndZoom, unknown>) => {
  const { extents, onToolEvent, viewport } = props

  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const pickTarget = useCallback((point: Point): CharacterId => {
    const computeDistance = (actor: Actor) => ({
      id: actor.id,
      distance: calculateDistance(actor.status.position, point),
    })

    const closeEnoughToTarget = ({ distance }: { distance: number }) => distance < 10

    return flow(
      map(computeDistance),
      filter(closeEnoughToTarget),
      sortBy(get('distance')),
      head,
      get('id')
    )(actors)
  }, [actors])

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    onToolEvent({
      type: 'set-target',
      payload: pickTarget(worldCoordinates),
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
