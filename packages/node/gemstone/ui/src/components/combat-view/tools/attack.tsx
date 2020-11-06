import { useCallback } from 'react'

import {
  CoordinateConverter,
  TapEvent,
  useCanvasEvent,
  useViewport,
} from '@thrashplay/canvas-with-tools'
import { createAction } from '@thrashplay/gemstone-engine'
import {
  CharacterId,
  FrameEvents,
  getClosestActor,
} from '@thrashplay/gemstone-model'
import { useDispatch, useFrameQuery, useSelector } from '@thrashplay/gemstone-ui-core'
import { Point } from '@thrashplay/math'

import { ToolProps } from '../../dispatch-view-event'
import { CombatViewEvent } from '../reducer'
import { CombatViewState } from '../state'

// maximum distance between cursor and actor that we consider a click
const MAX_CLICK_DISTANCE = 24

export const AttackTool = ({
  viewState,
}: ToolProps<CombatViewState, CombatViewEvent>) => {
  const { selectedActorId } = viewState

  const { extents, viewport } = useViewport()

  const dispatch = useDispatch()
  const frameQuery = useFrameQuery()
  const selectClosestActor = useSelector(getClosestActor)

  const pickTarget = useCallback((point: Point): CharacterId | undefined => {
    const closestActor = selectClosestActor({
      ...frameQuery,
      characterId: selectedActorId,
      position: point,
    })
    return closestActor.distance < MAX_CLICK_DISTANCE
      ? closestActor.actorId
      : undefined
  }, [frameQuery, selectClosestActor, selectedActorId])

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    const targetId = pickTarget(worldCoordinates)
    if (targetId !== undefined && selectedActorId !== undefined) {
      dispatch(
        FrameEvents.actionDeclared({
          action: createAction('attack', { target: targetId }),
          characterId: selectedActorId,
        })
      )
    }
  }

  useCanvasEvent('tap', handleTap)

  return (
    null
  )
}
