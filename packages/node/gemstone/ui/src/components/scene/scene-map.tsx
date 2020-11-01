import { flow, map, noop } from 'lodash/fp'
import React, { useCallback, useReducer } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Svg } from 'react-native-svg'

import { Canvas, ContentViewProps, Dimensions, Extents } from '@thrashplay/canvas-with-tools'
import { SceneCommands } from '@thrashplay/gemstone-engine'
import { Actor, FrameEvents, SceneEvents } from '@thrashplay/gemstone-model'

import { useDispatch } from '../../store'
import { WithFrameQuery, WithViewStyles } from '../prop-types'

import { AvatarAnimation, AvatarAnimationProps } from './avatar-animation'
import { AvatarProps, DefaultAvatar } from './default-avatar'
import { Grid } from './grid'
import { INITIAL_STATE, MapViewAction, reducer, ToolName } from './state'
import { ToolSelector } from './tool-selector'
import { MoveTool } from './tools/move-tool'
import { SetTargetTool } from './tools/set-target-tool'

const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
}

export type MoveActionHandler = (x: number, y: number) => void

export interface SceneMapProps extends WithFrameQuery, WithViewStyles<'style'> {
  /** list of actors in the scene */
  actors?: Actor[]

  /** extents for the map view, defaults to [0, 0]-[1000, 1000] */
  extents?: Extents

  /** handler called when the user attempts to set a move action */
  onMove?: MoveActionHandler

  /** render function used to create Avatar elements */
  renderAvatar?: (props: AvatarProps) => React.ReactNode

  /** the actor currently selected */
  selectedActor?: Actor

  /** time offset, in seconds, of the frame being rendered */
  timeOffset: number
}

export const SceneMap = ({
  actors = [],
  extents: initialExtents = DEFAULT_EXTENTS,
  onMove = noop,
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

  const globalDispatch = useDispatch()

  const { extents, selectedToolName } = state

  const handleToolEvent = useCallback((event: MapViewAction) => {
    switch (event.type) {
      case 'move':
        onMove(event.payload.x, event.payload.y)
        break

      case 'set-target':
        if (selectedActor !== undefined) {
          globalDispatch(
            event.payload === undefined
              ? FrameEvents.targetRemoved(selectedActor.id)
              : FrameEvents.targetChanged({
                characterId: selectedActor.id,
                targetId: event.payload,
              })
          )
        }
        break

      default:
        // all other events are local to our view, so we just update our state
        dispatch(event)
    }
  }, [globalDispatch, onMove, selectedActor])

  const handleToolSelect = useCallback((toolName: ToolName) => {
    dispatch({
      type: 'select-tool',
      payload: toolName,
    })
  }, [dispatch])

  const handleViewportChange = useCallback((viewport: Dimensions) => {
    dispatch({
      type: 'set-viewport',
      payload: viewport,
    })
  }, [])

  const SelectedTool = selectedToolName === 'move' ? MoveTool : SetTargetTool

  return (
    <View style={[styles.container, style]}>
      <ToolSelector onSelect={handleToolSelect} tools={['move', 'set-target']} />

      <Canvas
        data={{ actors, renderAvatar, style, selectedActor, timeOffset }}
        extents={extents}
        onToolEvent={handleToolEvent}
        onViewportChange={handleViewportChange}
        selectedTool={SelectedTool}
        style={{ flex: 1 }}
      >
        {MapContent}
      </Canvas>
    </View>
  )
}

const MapContent = ({
  data,
  extents,
}: ContentViewProps<SceneMapProps & { renderAvatar: (props: AvatarProps) => React.ReactNode }>) => {
  const { actors, renderAvatar, selectedActor, timeOffset } = data

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
      style={[styles.mapView]}
      viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}
    >
      <Grid
        gridSpacing={10}
        mapHeight={500}
        mapWidth={500}
      />
      {renderAvatars()}
    </Svg>
  )
}

const container: ViewStyle = {
  flexDirection: 'column',
}

const mapView: ViewStyle = {
  backgroundColor: '#eee',
  borderWidth: 1,
  borderColor: '#666',
  marginBottom: 0,
  marginTop: 8,
}

const styles = StyleSheet.create({
  container,
  mapView,
})
