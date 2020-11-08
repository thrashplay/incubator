import { castArray, map } from 'lodash/fp'
import React, { PropsWithChildren, useCallback } from 'react'
import { Rect, Svg } from 'react-native-svg'

import { useViewport } from '@thrashplay/canvas-with-tools'
import { Area, getAreas, getThings, Thing } from '@thrashplay/gemstone-map-model'
import { ActorDecoratorFunction, AreasRenderer, Grid, MapAreaDecoratorFunction } from '@thrashplay/gemstone-map-ui'
import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue, useWorldCoordinateConverter } from '@thrashplay/gemstone-ui-core'

import { AnimatedAvatar } from './animated-avatar'

const EMPTY_DECORATOR_ARRAY = [] as const
const EMPTY_DECORATOR_GETTER = () => EMPTY_DECORATOR_ARRAY

export interface MapContentProps {
  /**
   * Function that provides an array of ActorDecoratorFunctions for actors based on their ID.
   * Can be used to provide custom rendering behavior based on game state.
   */
  getActorDecorators?: (actorId: Actor['id']) => readonly ActorDecoratorFunction[] | ActorDecoratorFunction | undefined

  /**
   * Function that returns a set of decorators to use for rendering all actors, before view-specific ones.
   * Defaults to showing circles with a single-character actor identifier.
   **/
  getDefaultActorDecorators?: () => readonly ActorDecoratorFunction[] | ActorDecoratorFunction

  /** Function that returns a set of decorators to use for rendering all map areas, before view-specific ones */
  getDefaultMapAreaDecorators?: () => readonly MapAreaDecoratorFunction[] | MapAreaDecoratorFunction
  /**
   * Function that provides an array of MapAreaDecoratorFunctions for map areas based on their ID.
   * Can be used to provide custom rendering behavior based on game state.
   */
  getMapAreaDecorators?: (
    areaId: Area['id']
  ) => readonly MapAreaDecoratorFunction[] | MapAreaDecoratorFunction | undefined
}

export const MapContent = ({
  children,
  getActorDecorators = EMPTY_DECORATOR_GETTER,
  getDefaultActorDecorators = EMPTY_DECORATOR_GETTER,
  getDefaultMapAreaDecorators = EMPTY_DECORATOR_GETTER,
  getMapAreaDecorators = EMPTY_DECORATOR_GETTER,
}: PropsWithChildren<MapContentProps>) => {
  const { extents, viewport } = useViewport()
  const { extentsToCanvas } = useWorldCoordinateConverter()
  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)
  const areas = useValue(getAreas)
  const things = useValue(getThings)

  const renderArea = useCallback((area: Area) => {
    const defaults = getDefaultMapAreaDecorators()
    const extra = getMapAreaDecorators(area.id) ?? EMPTY_DECORATOR_ARRAY

    const invokeDecorator = (decorator: MapAreaDecoratorFunction) => decorator({ areaId: area.id })

    return map(invokeDecorator)([...castArray(defaults), ...castArray(extra)])
  }, [getDefaultMapAreaDecorators, getMapAreaDecorators])

  const renderAvatar = useCallback((actor: Actor) => {
    const defaults = getDefaultActorDecorators()
    const extra = getActorDecorators(actor.id) ?? EMPTY_DECORATOR_ARRAY

    return (
      <AnimatedAvatar key={actor.id} actorId={actor.id}>
        {[...castArray(defaults), ...castArray(extra)]}
      </AnimatedAvatar>
    )
  }, [getActorDecorators, getDefaultActorDecorators])

  const renderThing = useCallback((thing: Thing) => {
    const { x, y, width, height } = extentsToCanvas(thing.bounds)

    return (
      <Rect key={thing.id}
        fill="black"
        height={height}
        width={width}
        x={x}
        y={y}
      />
    )
  }, [extentsToCanvas])

  return (
    <Svg
      viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}
      height={viewport.height}
      // width={viewport.width}
    >
      {map(renderArea)(areas)}
      <Grid
        gridSpacing={5}
        mapHeight={500}
        mapWidth={500}
      />
      {map(renderThing)(things)}
      {map(renderAvatar)(actors)}
      {children}
    </Svg>
  )
}
