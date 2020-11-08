import { get } from 'lodash/fp'
import React from 'react'
import { Circle, CircleProps, LineProps } from 'react-native-svg'

import { ActorDecoratorFunction, ActorDecoratorProps } from '@thrashplay/gemstone-map-ui'
import { getAction, getReach, getSize } from '@thrashplay/gemstone-model'
import { feetToPixels, useFrameQuery, useValue, useWorldCoordinateConverter } from '@thrashplay/gemstone-ui-core'
import { calculateDistance, Point } from '@thrashplay/math'

import { useAnchorPoint } from '../../map-elements'
import { SegmentedVector } from '../../map-elements/segmented-vector'

export interface MovementPreviewProps {
  /** SVG styles to use for rendering the movement vector line (defaults to a gray dashed line) */
  lineStyle?: LineProps

  /** controls whether the movement vector line is show or not (defaults to true) */
  showLine?: boolean

  /** controls whether the body is rendered in the new location or not (defaults to false) */
  showTargetBody?: boolean

  /** controls whether the reach is rendered in the new location or not (defaults to false) */
  showTargetReach?: boolean

  /** SVG styles to use for rendering the actor's body circle in the new location */
  targetBodyStyle?: CircleProps

  /** SVG styles to use for rendering the actor's reach circle in the new location */
  targetReachStyle?: CircleProps
}

/**
 * Creates an ActorBodyCircle decorator with the specified circle props.
 */
export const createMovementPreview = (movementPreviewProps: MovementPreviewProps = {}): ActorDecoratorFunction =>
  // eslint-disable-next-line react/display-name
  ({ actorId }: ActorDecoratorProps) => <MovementPreview {...movementPreviewProps} actorId={actorId} />

/**
 * Renders a configurable preview of an actor's movement.
 */
export const MovementPreview = ({ actorId, ...movementPreviewProps }: ActorDecoratorProps & MovementPreviewProps) => {
  const {
    lineStyle = LineStyles.Dashed,
    showLine = true,
    showTargetBody,
    showTargetReach,
    targetBodyStyle = {},
    targetReachStyle = {},
  } = movementPreviewProps

  const { toCanvas } = useWorldCoordinateConverter()
  const anchor = useAnchorPoint()

  const query = { ...useFrameQuery(), characterId: actorId }

  const size = useValue(getSize, query)
  const sizeInCanvas = feetToPixels(size)
  const reach = useValue(getReach, query)
  const reachInCanvas = feetToPixels(reach)

  const action = useValue(getAction, query)

  /** Renders a line between the current and target locations. */
  const renderLine = (destinationInCanvas: Point) => {
    const totalDistance = calculateDistance(anchor, destinationInCanvas)

    return (
      <SegmentedVector
        breakpoints={[sizeInCanvas / 2, totalDistance - sizeInCanvas / 2]}
        destination={destinationInCanvas}
        segmentStyles={[LineStyles.None, lineStyle, LineStyles.None]}
        start={anchor}
      />
    )
  }

  /** Renders the body at the move destination. */
  const renderTargetBody = (destinationInCanvas: Point) => {
    return (
      <Circle
        cx={destinationInCanvas.x}
        cy={destinationInCanvas.y}
        r={sizeInCanvas / 2}
        {...targetBodyStyle}
      />
    )
  }

  /** Renders the reach at the move destination. */
  const renderTargetReach = (destinationInCanvas: Point) => {
    return (
      <Circle
        cx={destinationInCanvas.x}
        cy={destinationInCanvas.y}
        r={reachInCanvas}
        {...targetReachStyle}
      />
    )
  }

  const renderChildren = () => {
    const destination = toCanvas(get('data')(action))

    return (
      <>
        {showLine && renderLine(destination)}
        {showTargetBody && renderTargetBody(destination)}
        {showTargetReach && renderTargetReach(destination)}
      </>
    )
  }

  return action?.type !== 'move'
    ? null
    : renderChildren()
}

const LineStyles = {
  Dashed: {
    stroke: '#666',
    strokeDasharray: [1, 1],
    strokeWidth: 0.5,
  },
  None: {
    strokeWidth: 0,
  },
}
