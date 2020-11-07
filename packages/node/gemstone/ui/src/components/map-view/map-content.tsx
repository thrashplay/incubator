import { castArray, map } from 'lodash/fp'
import React, { PropsWithChildren, useCallback } from 'react'
import { Svg } from 'react-native-svg'

import { useViewport } from '@thrashplay/canvas-with-tools'
import { Area } from '@thrashplay/gemstone-map-model'
import { AreasRenderer, Grid } from '@thrashplay/gemstone-map-ui'
import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { AnimatedAvatar } from './animated-avatar'
import { ActorDecoratorFunction, MapAreaDecoratorFunction } from './decorators'

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
  getDefaultMapAreaDecorators?: () => readonly MapAreaDecoratorFunction[] | ActorDecoratorFunction
  /**
   * Function that provides an array of MapAreaDecoratorFunctions for map areas based on their ID.
   * Can be used to provide custom rendering behavior based on game state.
   */
  getMapAreaDecorators?: (
    areaId: Area['id']
  ) => readonly MapAreaDecoratorFunction[] | ActorDecoratorFunction | undefined
}

export const MapContent = ({
  children,
  getActorDecorators = EMPTY_DECORATOR_GETTER,
  getDefaultActorDecorators = EMPTY_DECORATOR_GETTER,
  getDefaultMapAreaDecorators = EMPTY_DECORATOR_GETTER,
  getMapAreaDecorators = EMPTY_DECORATOR_GETTER,
}: PropsWithChildren<MapContentProps>) => {
  const { extents, viewport } = useViewport()
  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const renderAvatar = useCallback((actor: Actor) => {
    const defaults = getDefaultActorDecorators()
    const extra = getActorDecorators(actor.id) ?? EMPTY_DECORATOR_ARRAY

    return (
      <AnimatedAvatar key={actor.id} actorId={actor.id}>
        {[...castArray(defaults), ...castArray(extra)]}
      </AnimatedAvatar>
    )
  }, [getActorDecorators, getDefaultActorDecorators])

  return (
    <Svg
      viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}
      height={viewport.height}
      // width={viewport.width}
    >
      <AreasRenderer />
      <Grid
        gridSpacing={10}
        mapHeight={500}
        mapWidth={500}
      />
      {map(renderAvatar)(actors)}
      {children}
    </Svg>
  )
}
