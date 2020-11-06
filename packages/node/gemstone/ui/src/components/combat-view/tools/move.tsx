import { filter, flow, reduce } from 'lodash/fp'
import { useCallback } from 'react'

import {
  CoordinateConverter,
  DragEvent,
  TapEvent,
  useCanvasEvent,
  useViewport,
} from '@thrashplay/canvas-with-tools'
import { createAction } from '@thrashplay/gemstone-engine'
import {
  Actor,
  CharacterId,
  FrameEvents,
  getActors,
  getReach,
  getSize,
} from '@thrashplay/gemstone-model'
import { useDispatch, useFrameQuery, useSelector, useValue } from '@thrashplay/gemstone-ui-core'
import { calculateDistance, Point } from '@thrashplay/math'

import { ToolProps } from '../../dispatch-view-event'
import { CombatViewEvent } from '../reducer'
import { CombatViewState } from '../state'

export const MoveTool = ({ viewState }: ToolProps<CombatViewState, CombatViewEvent>) => {
  const { selectedActorId } = viewState

  const { extents, viewport } = useViewport()

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
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld({ x, y })

    highlightTargetsInRange(worldCoordinates)

    // toolEventDispatch({
    //   type: 'move',
    //   payload: worldCoordinates,
    // })

    dispatchMove(worldCoordinates)
  }, [dispatchMove, extents, highlightTargetsInRange, viewport])

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    // toolEventDispatch({
    //   type: 'move',
    //   payload: worldCoordinates,
    // })
  }

  useCanvasEvent('tap', handleTap)
  useCanvasEvent('drag', handleDrag)

  return (
    null
  )
}
