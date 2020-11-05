import { find, flow, isEmpty, map, matches, noop } from 'lodash/fp'
import React, { ReactElement, useCallback, useMemo, useReducer } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Rect, Svg } from 'react-native-svg'

import {
  Canvas,
  ContentViewProps,
  PanAndZoomTool,
  ToolEvent,
  ToolEventDispatch,
  ToolProps,
} from '@thrashplay/canvas-with-tools'
import { Area } from '@thrashplay/gemstone-map-model'
import { AreasRenderer, Grid } from '@thrashplay/gemstone-map-ui'
import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue, WithFrameQuery } from '@thrashplay/gemstone-ui-core'
import { Dimensions, Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { AvatarAnimation, AvatarAnimationProps } from './avatar-animation'
import { INITIAL_STATE, MapViewAction, reducer } from './map-view-state'

const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
}

export type MoveActionHandler = (x: number, y: number) => void

export interface ToolOption<TData extends any = any> {
  component: (props: ToolProps<any, TData>) => ReactElement | null
  icon: string
  id: string
}

const PanAndZoomOption = {
  component: PanAndZoomTool,
  icon: 'hand',
  id: 'pan-and-zoom',
}

export interface SceneMapProps<TData extends any = any> extends WithFrameQuery, WithViewStyles<'style'> {
  /** extents for the map view, defaults to [0, 0]-[1000, 1000] */
  extents?: Extents

  overlay?: (props: ContentViewProps<TData>) => JSX.Element

  /** time offset, in seconds, of the frame being rendered */
  timeOffset: number

  /** dispatch function called by tool implementations */
  toolEventDispatch?: ToolEventDispatch<any>

  /** set of tools available for this map */
  toolOptions?: readonly ToolOption<TData>[]
}

export interface SceneMapData extends Omit<SceneMapProps, 'extents'> {
  /** ID of the map area currently selected */
  selectedMapAreaId?: Area['id']
}

export const MapView = <TData extends any = any>({
  extents: initialExtents = DEFAULT_EXTENTS,
  style,
  timeOffset,
  toolEventDispatch = noop,
  toolOptions = [],
}: SceneMapProps<TData>) => {
  // zoom to full extents the when the map is first displayed
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => ({
    ...initialState,
    extents: initialExtents,
  }))

  const { extents, selectedToolId } = state

  const selectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )([PanAndZoomOption, ...toolOptions]) as ToolOption | undefined
    return option?.component
  }, [selectedToolId, toolOptions])

  const handleToolSelect = useCallback((toolId: string) => {
    dispatch({
      type: 'select-tool',
      payload: toolId,
    })
  }, [dispatch])

  const handleViewportChange = useCallback((viewport: Dimensions) => {
    dispatch({
      type: 'set-viewport',
      payload: viewport,
    })
  }, [])

  const handleToolEvent = useCallback((event: ToolEvent) => {
    dispatch(event as MapViewAction)
    toolEventDispatch(event)
  }, [dispatch, toolEventDispatch])

  return (
    <View style={[styles.container, style]}>
      {!isEmpty(toolOptions) && (
        <ToolSelectorButtonBar
          onSelect={handleToolSelect}
          options={[PanAndZoomOption, ...toolOptions]}
          selectedId={selectedToolId}
        />
      )}

      <Canvas
        data={{ style, timeOffset }}
        extents={extents}
        toolEventDispatch={handleToolEvent}
        onViewportChange={handleViewportChange}
        selectedTool={selectedTool}
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
}: ContentViewProps<SceneMapData>) => {
  const { timeOffset } = data

  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const createAvatarRenderProps = useCallback((actor: Actor): AvatarAnimationProps => {
    const position = actor.status.position
    return {
      actorId: actor.id,
      timeOffset,
      x: position.x,
      y: position.y,
    }
  }, [timeOffset])

  const renderAvatars = useCallback(() => flow(
    map(createAvatarRenderProps),
    map((props: AvatarAnimationProps) => <AvatarAnimation key={props.actorId} {...props} />)
  )(actors), [actors, createAvatarRenderProps])

  return (
    <Svg
      fill="black"
      fillOpacity={1}
      style={[styles.mapView]}
      viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}
    >
      <Rect
        {...extents}
        fill="black"
      />
      <AreasRenderer />
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
  flex: 1,
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
