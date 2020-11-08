import React from 'react'
import { CircleProps } from 'react-native-svg'

import { ActorDecoratorFunction, ActorDecoratorProps } from '@thrashplay/gemstone-map-ui'
import { getSize } from '@thrashplay/gemstone-model'
import { feetToPixels, useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { CircleDecorator } from '../../map-elements/circle-decorator'

/**
 * Creates an ActorBodyCircle decorator with the specified circle props.
 */
export const createActorBodyCircle = (circleProps: CircleProps): ActorDecoratorFunction =>
  // eslint-disable-next-line react/display-name
  ({ actorId }: ActorDecoratorProps) => <ActorBodyCircle {...circleProps} actorId={actorId} />

/**
 * Renders a custom-styled Circle with the position and size based on the location of an actor's body
 * in the game world. Uses the default SVG styles for a circle if none are supplied.
 *
 * NOTE: This has to be a separate component, because using hooks inside a renderProp function violates the
 * "rules of hooks".
 */
export const ActorBodyCircle = ({ actorId, ...circleProps }: ActorDecoratorProps & CircleProps) => {
  const query = { ...useFrameQuery(), characterId: actorId }
  const size = useValue(getSize, query)
  const renderSize = feetToPixels(size)

  return (
    <CircleDecorator {...circleProps} radius={renderSize / 2} />
  )
}

export const ActorBodyCircles = {
  Default: createActorBodyCircle({
    fillOpacity: 0.25,
    fill: 'black',
    strokeWidth: 0,
  }),
  Selected: createActorBodyCircle({
    fillOpacity: 0.25,
    fill: 'red',
  }),
}
