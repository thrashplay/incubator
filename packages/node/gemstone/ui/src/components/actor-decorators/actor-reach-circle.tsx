import React from 'react'
import { CircleProps } from 'react-native-svg'

import { getReach } from '@thrashplay/gemstone-model'
import { feetToPixels, useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { CircleDecorator } from '../../map-elements/circle-decorator'
import { ActorDecoratorFunction, ActorDecoratorProps } from '../map-view/decorators'

/**
 * Creates an ActorReachCircle decorator with the specified circle props.
 */
export const createActorReachCircle = (circleProps: CircleProps): ActorDecoratorFunction =>
  // eslint-disable-next-line react/display-name
  ({ actorId }: ActorDecoratorProps) => <ActorReachCircle {...circleProps} actorId={actorId} />

/**
 * Renders a custom-styled Circle with the position and size based on the location of an actor's reach
 * in the game world. Uses the default SVG styles for a circle if none are supplied.
 *
 * NOTE: This has to be a separate component, because using hooks inside a renderProp function violates the
 * "rules of hooks".
 */
export const ActorReachCircle = ({ actorId, ...circleProps }: ActorDecoratorProps & CircleProps) => {
  const query = { ...useFrameQuery(), characterId: actorId }
  const reach = useValue(getReach, query)
  const reachInCanvasCoords = feetToPixels(reach)

  return (
    <CircleDecorator {...circleProps} radius={reachInCanvasCoords} />
  )
}

export const ActorReachCircles = {
  Default: createActorReachCircle({
    fill: 'gray',
    fillOpacity: 0.25,
    strokeWidth: 0,
  }),
  Selected: createActorReachCircle({
    fill: 'red',
    fillOpacity: 0.25,
  }),
}
