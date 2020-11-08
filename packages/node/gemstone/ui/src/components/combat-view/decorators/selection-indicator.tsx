import { CircleDecorator } from 'gemstone/ui/src/map-elements/circle-decorator'
import React from 'react'

import { getSize } from '@thrashplay/gemstone-model'
import { feetToPixels, useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'

import { ActorDecoratorProps } from '../../map-view/decorators'

export const SelectionIndicator = ({ actorId }: ActorDecoratorProps) => {
  const query = { ...useFrameQuery(), characterId: actorId }
  const size = useValue(getSize, query)
  const renderSize = feetToPixels(size)

  return (
    <CircleDecorator {...styles.circle} radius={renderSize / 2} />
  )
}

const styles = {
  circle: {
    fillOpacity: 0.25,
    fill: 'red',
  },
} as const
