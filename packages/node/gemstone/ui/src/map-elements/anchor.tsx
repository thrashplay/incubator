import React, { useContext } from 'react'
import { Animated } from 'react-native'

import { Point } from '@thrashplay/math'

export interface AnchorProps {
  children: React.ReactNode | React.ReactNode[]
  x: number
  y: number
}

export const AnchorContext = React.createContext<Point>({ x: 0, y: 0 })

/**
 * Retrieves the position, in canvas coordinates, of the containing anchor.
 * This is used by descendant elements ('decorators') to draw in position's relative to some common
 * base.
 */
export const useAnchorPoint = () => {
  return useContext(AnchorContext)
}

/**
 * Abstract representation of an Actor with a position in the game world.
 *
 * This class tracks an actor's position, but provides no built-in rendering. Rendering is handled
 * by child 'Decorators' which are used to render an on-screen representation of this actor and
 * any associated state.
 */
export class Anchor extends React.Component<AnchorProps> {
  public render () {
    return (
      <AnchorContext.Provider value={this.props}>
        {this.props.children}
      </AnchorContext.Provider>
    )
  }
}

export const AnimatedAnchor = Animated.createAnimatedComponent(Anchor)
