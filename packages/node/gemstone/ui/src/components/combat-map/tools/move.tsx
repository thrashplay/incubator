import { filter, flow, reduce } from 'lodash/fp'
import React, { useCallback } from 'react'

import {
  CoordinateConverter,
  DragEvent,
  PanAndZoomEvent,
  TapEvent,
  ToolEvent,
  ToolProps,
  useCanvasEvent,
  ZoomComponent,
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

import { SceneMapData } from '../scene-map'
import { SetHighlightsEvent } from '../state'

export type MoveEvent = ToolEvent<'move', Point>

export const MoveTool = (
  { data, ...props }: ToolProps<SetHighlightsEvent | MoveEvent | PanAndZoomEvent, SceneMapData>
) => {
  const { extents, toolEventDispatch, viewport } = props
  const { selectedActor } = data

  const dispatch = useDispatch()
  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)
  const reach = useValue(getReach, { ...frameQuery, characterId: selectedActor?.id })
  const selectSize = useSelector(getSize)

  const dispatchMove = useCallback((destination: Point) => {
    if (selectedActor !== undefined) {
      dispatch(FrameEvents.actionDeclared({
        action: createAction('move', destination),
        characterId: selectedActor.id,
      }))
    }
  }, [dispatch, selectedActor])

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

      toolEventDispatch({
        type: 'set-highlights',
        payload: highlights,
      })
    }

    flow(
      filter(closeEnoughToTarget),
      setHighlightedActors
    )(actors)
  }, [actors, frameQuery, reach, selectSize, toolEventDispatch])

  const handleDrag = useCallback(({
    x,
    y,
  }: DragEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld({ x, y })

    highlightTargetsInRange(worldCoordinates)

    toolEventDispatch({
      type: 'move',
      payload: worldCoordinates,
    })

    dispatchMove(worldCoordinates)
  }, [dispatchMove, extents, highlightTargetsInRange, toolEventDispatch, viewport])

  const handleTap = (coordinates: TapEvent) => {
    const convertCoordinates = new CoordinateConverter(extents, viewport)
    const worldCoordinates = convertCoordinates.toWorld(coordinates)

    toolEventDispatch({
      type: 'move',
      payload: worldCoordinates,
    })
  }

  useCanvasEvent('tap', handleTap)
  useCanvasEvent('drag', handleDrag)

  return (
    <ZoomComponent {...props} />
  )
}
