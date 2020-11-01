import { useFrameQuery } from 'gemstone/ui/src/frame-context'
import { useValue } from 'gemstone/ui/src/store'
import { filter, flow, get, head, map, sortBy } from 'lodash/fp'
import React, { useCallback } from 'react'

import {
  CoordinateConverter,
  PanAndZoomEvent,
  PanAndZoomTool,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { Actor, calculateDistance, CharacterId, getActors, Point } from '@thrashplay/gemstone-model'

import { SceneMapData } from '../scene-map'

export type SetTargetEvent = ToolEvent<'set-target', CharacterId | undefined>

export const SetTargbetTool = (
  { ...props }: ToolProps<SetTargetEvent | PanAndZoomEvent, SceneMapData>
) => {
  const { extents, toolEventDispatch, viewport } = props

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

    toolEventDispatch({
      type: 'set-target',
      payload: pickTarget(worldCoordinates),
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    <PanAndZoomTool {...props} />
  )
}
