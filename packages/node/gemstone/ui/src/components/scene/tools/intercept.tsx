import { useFrameQuery } from 'gemstone/ui/src/frame-context'
import { useValue } from 'gemstone/ui/src/store'
import { filter, flow, get, head, map, sortBy } from 'lodash/fp'
import { useCallback } from 'react'

import {
  CoordinateConverter,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { Actor, CharacterId, getActors, Point } from '@thrashplay/gemstone-model'
import { calculateDistance } from '@thrashplay/math'

import { SceneMapData } from '../scene-map'

export type AttackEvent = ToolEvent<'attack', CharacterId | undefined>

export const AttackTool = ({ data, ...props }: ToolProps<AttackEvent, SceneMapData>) => {
  const { selectedActor } = data
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
      type: 'attack',
      payload: pickTarget(worldCoordinates),
    })
  }

  useCanvasEvent('tap', handleTap)

  return (
    null
  )
}
