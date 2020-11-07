import React from 'react'
import { TextProps } from 'react-native-svg'

import { getPublicCharacterName } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { ActorDecoratorFunction, ActorDecoratorProps } from '../components/map-view/decorators'

import { TextDecorator } from './text-decorator'

/**
 * Creates an ActorBodyCircle decorator with the specified circle props.
 */
export const createActorFirstInitialLabel = (textProps: TextProps): ActorDecoratorFunction =>
  // eslint-disable-next-line react/display-name
  ({ actorId }: ActorDecoratorProps) => <ActorFirstInitialLabel {...textProps} actorId={actorId} />

/**
 * Renders a custom-styled Circle with the position and size based on the location of an actor's body
 * in the game world. Uses the default SVG styles for a circle if none are supplied.
 *
 * NOTE: This has to be a separate component, because using hooks inside a renderProp function violates the
 * "rules of hooks".
 */
export const ActorFirstInitialLabel = ({ actorId, ...textProps }: ActorDecoratorProps & CircleProps) => {
  const query = { ...useFrameQuery(), characterId: actorId }
  const name = useValue(getPublicCharacterName, query)

  return (
    <TextDecorator
      {...textProps}
      offsetY={6}
      text={name.slice(0, 1)}
    />
  )
}

export const ActorFirstInitialLabels = {
  Default: createActorFirstInitialLabel({
    fontSize: 18,
    textAnchor: 'middle',
  }),
}
