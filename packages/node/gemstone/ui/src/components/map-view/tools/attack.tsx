import { useCallback } from 'react'

import {
  CoordinateConverter,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { createAction } from '@thrashplay/gemstone-engine'
import {
  CharacterId,
  FrameEvents,
  getClosestActor,
} from '@thrashplay/gemstone-model'
import { useDispatch, useFrameQuery, useSelector } from '@thrashplay/gemstone-ui-core'
import { Point } from '@thrashplay/math'

import { SceneMapData } from '../scene-map'

// maximum distance between cursor and actor that we consider a click
const MAX_CLICK_DISTANCE = 24

export type AttackEvent = ToolEvent<'attack', CharacterId | undefined>

export const AttackTool = ({ data, ...props }: ToolProps<AttackEvent, SceneMapData>) => {
  const { extents, viewport } = props
  const { selectedActor } = data

  const dispatch = useDispatch()
  const frameQuery = useFrameQuery()
  const selectClosestActor = useSelector(getClosestActor)

  const pickTarget = useCallback((point: Point): CharacterId | undefined => {
    const closestActor = selectClosestActor({ ...frameQuery, position: point })
    return closestActor.distance < MAX_CLICK_DISTANCE
      ? closestActor.actorId
      : undefined
  }, [frameQuery, selectClosestActor])

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    const targetId = pickTarget(worldCoordinates)
    if (targetId !== undefined && selectedActor !== undefined) {
      dispatch(
        FrameEvents.actionDeclared({
          action: createAction('attack', { target: targetId }),
          characterId: selectedActor.id,
        })
      )
    }
  }

  useCanvasEvent('tap', handleTap)

  return (
    null
  )
}
