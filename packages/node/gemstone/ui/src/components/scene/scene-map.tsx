import { flow, map, noop } from 'lodash/fp'
import React, { useCallback, useReducer } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Svg } from 'react-native-svg'

import { Canvas, ContentViewProps, Dimensions, Extents } from '@thrashplay/canvas-with-tools'
import { Actor } from '@thrashplay/gemstone-model'

import { AvatarAnimation, AvatarAnimationProps } from './avatar-animation'
import { AvatarProps, DefaultAvatar } from './default-avatar'
import { Grid } from './grid'
import { INITIAL_STATE, MapViewAction, reducer } from './state'
import { SetMoveIntentionTool } from './tools/set-move-intention-tool'

const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
}

export type SetMoveIntentionHandler = (x: number, y: number) => void

export interface SceneMapProps {
  /** list of actors in the scene */
  actors?: Actor[]

  /** extents for the map view, defaults to [0, 0]-[1000, 1000] */
  extents?: Extents

  /** handler called when the user attempts to set a move intention */
  onSetMoveIntention?: SetMoveIntentionHandler

  /** render function used to create Avatar elements */
  renderAvatar?: (props: AvatarProps) => React.ReactNode

  /** the actor currently selected */
  selectedActor?: Actor

  /** style to apply to the maps's container */
  style?: StyleProp<ViewStyle>

  /** time offset, in seconds, of the frame being rendered */
  timeOffset: number
}

export const SceneMap = ({
  actors = [],
  extents: initialExtents = DEFAULT_EXTENTS,
  onSetMoveIntention = noop,
  renderAvatar = DefaultAvatar,
  selectedActor,
  style,
  timeOffset,
}: SceneMapProps) => {
  // zoom to full extents the when the map is first displayed
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => ({
    ...initialState,
    extents: initialExtents,
  }))

  const { extents, selectedToolName } = state

  const handleToolEvent = useCallback((event: MapViewAction) => {
    switch (event.type) {
      case 'set-move-intention':
        onSetMoveIntention(event.payload.x, event.payload.y)
        break

      default:
        // all other events are local to our view, so we just update our state
        dispatch(event)
    }
  }, [onSetMoveIntention])

  const handleViewportChange = useCallback((viewport: Dimensions) => {
    dispatch({
      type: 'set-viewport',
      payload: viewport,
    })
  }, [])

  return (
    <Canvas
      data={{ actors, renderAvatar, style, selectedActor, timeOffset }}
      extents={extents}
      onToolEvent={handleToolEvent}
      onViewportChange={handleViewportChange}
      selectedTool={SetMoveIntentionTool}
      style={{ flex: 1 }}
    >
      {MapContent}
    </Canvas>
  )
}

const MapContent = ({
  data,
  extents,
}: ContentViewProps<SceneMapProps & { renderAvatar: (props: AvatarProps) => React.ReactNode }>) => {
  const { actors, renderAvatar, selectedActor, style, timeOffset } = data

  const createAvatarRenderProps = useCallback((actor: Actor): AvatarAnimationProps => {
    const position = actor.status.position
    return {
      actor,
      renderAvatar,
      selected: selectedActor?.id === actor.id,
      timeOffset,
      x: position.x,
      y: position.y,
    }
  }, [renderAvatar, selectedActor?.id, timeOffset])

  const renderAvatars = useCallback(() => flow(
    map(createAvatarRenderProps),
    map((props: AvatarAnimationProps) => <AvatarAnimation key={props.actor.id} {...props} />)
  )(actors), [actors, createAvatarRenderProps])

  return (
    <Svg
      style={[styles.container, style]}
      viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}
    >
      <Grid
        gridSpacing={12.5}
        mapHeight={500}
        mapWidth={500}
      />
      {renderAvatars()}
    </Svg>
  )
}

const container: ViewStyle = {
  backgroundColor: '#eee',
  borderWidth: 1,
  borderColor: '#666',
  marginBottom: 0,
  marginTop: 0,
}

const styles = StyleSheet.create({
  container,
})
