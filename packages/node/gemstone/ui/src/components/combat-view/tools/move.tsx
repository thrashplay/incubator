import { filter, flow, reduce } from 'lodash/fp'
import { useCallback } from 'react'

import {
  DragEvent,
  TapEvent,
  useCanvasEvent,
} from '@thrashplay/canvas-with-tools'
import { createAction } from '@thrashplay/gemstone-engine-v1'
import {
  Actor,
  CharacterId,
  FrameEvents,
  getActors,
  getReach,
  getSize,
} from '@thrashplay/gemstone-model'
import {
  useCanvasCoordinateConverter,
  useDispatch,
  useFrameQuery,
  useSelector,
  useValue,
} from '@thrashplay/gemstone-ui-core'
import { calculateDistance, Point } from '@thrashplay/math'

import { ToolProps } from '../../dispatch-view-event'
import { CombatViewEvent } from '../events'
import { CombatViewState } from '../state'

export const MoveTool = ({ viewState }: ToolProps<CombatViewState, CombatViewEvent>) => {
  const { selectedActorId } = viewState

  const { toWorld } = useCanvasCoordinateConverter()

  const dispatch = useDispatch()
  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)
  const reach = useValue(getReach, { ...frameQuery, characterId: selectedActorId })
  const selectSize = useSelector(getSize)

  const dispatchMove = useCallback((destination: Point) => {
    if (selectedActorId !== undefined) {
      dispatch(FrameEvents.actionDeclared({
        action: createAction('move', destination),
        characterId: selectedActorId,
      }))
    }
  }, [dispatch, selectedActorId])

  const highlightTargetsInRange = useCallback((newLocation: Point) => {
    const closeEnoughToTarget = (target: Actor) => {
      const targetSize = selectSize({ ...frameQuery, characterId: target.id })
      const distance = calculateDistance(newLocation, target.status.position)

      return distance < reach + targetSize
    }

    const setHighlightedActors = (actors: Actor[]) => {
      const addActor = (result: { [k in CharacterId]?: boolean }, actor: Actor) => ({
        ...result,
        [actor.id]: true,
      })

      const highlights = reduce(addActor)({})(actors)

      // dispatchViewEvent({
      //   type: 'set-highlights',
      //   payload: highlights,
      // })
    }

    flow(
      filter(closeEnoughToTarget),
      setHighlightedActors
    )(actors)
  }, [actors, frameQuery, reach, selectSize])

  const handleDrag = useCallback(({
    x,
    y,
  }: DragEvent) => {
    const worldCoordinates = toWorld({ x, y })

    highlightTargetsInRange(worldCoordinates)
    dispatchMove(worldCoordinates)
  }, [dispatchMove, highlightTargetsInRange, toWorld])

  const handleTap = useCallback((coordinates: TapEvent) => {
    const worldCoordinates = toWorld(coordinates)
    dispatchMove(worldCoordinates)
  }, [dispatchMove, toWorld])

  useCanvasEvent('tap', handleTap)
  useCanvasEvent('drag', handleDrag)

  return (
    null
  )
}
