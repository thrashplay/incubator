import { noop } from 'lodash'
import { find, flow, isEmpty, map, matches } from 'lodash/fp'
import React, { PropsWithChildren, ReactElement, useCallback, useMemo, useReducer } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Rect, Svg } from 'react-native-svg'

import {
  Canvas,
  PanAndZoomMode,
  useViewport,
} from '@thrashplay/canvas-with-tools'
import { AreasRenderer, Grid } from '@thrashplay/gemstone-map-ui'
import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue, WithFrameQuery } from '@thrashplay/gemstone-ui-core'
import { Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { ToolProps, ViewEvent, ViewEventDispatch } from '../dispatch-view-event'

import { AvatarAnimation, AvatarAnimationProps } from './avatar-animation'
import { MapViewEvent, MapViewEvents, reducer } from './reducer'
import { DEFAULT_EXTENTS, INITIAL_STATE } from './state'

export type MoveActionHandler = (x: number, y: number) => void

export interface ToolOption<TState extends unknown = any, TViewEvent extends ViewEvent = any> {
  component: (props: ToolProps<TState, TViewEvent>) => ReactElement | null
  icon: string
  id: string

  /** the pan/zoom mode to enable while using this tool, defaults to 'none' */
  panAndZoomMode?: PanAndZoomMode
}

const PanAndZoomOption = {
  component: null,
  icon: 'hand',
  id: 'pan-and-zoom',
  panAndZoomMode: 'pan-and-zoom',
}

export interface MapViewProps<
  TViewState extends unknown = any,
  TViewEvent extends ViewEvent = any
> extends WithFrameQuery, WithViewStyles<'style'> {
  /** React nodes to render as overlays on top of the rendered map */
  children?: React.ReactNode

  /** dispatch function called by tool implementations */
  dispatchViewEvent?: ViewEventDispatch<TViewEvent>

  /** extents for the map view, defaults to [0, 0]-[500, 500] */
  extents?: Extents

  panAndZoomMode?: PanAndZoomMode

  /** set of tools available for this view */
  toolOptions?: readonly ToolOption<TViewState, MapViewEvent>[]
}

export const MapView = <TViewEvent extends ViewEvent = any>({
  children = null,
  dispatchViewEvent = noop,
  extents: initialExtents = DEFAULT_EXTENTS,
  style,
  toolOptions = [],
}: MapViewProps<TViewEvent>) => {
  // zoom to full extents the when the map is first displayed
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => ({
    ...initialState,
    extents: initialExtents,
  }))

  const { extents, selectedToolId } = state

  const toolOption = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )([PanAndZoomOption, ...toolOptions]) as ToolOption | undefined
    return option
  }, [selectedToolId, toolOptions])

  const { component: SelectedTool, panAndZoomMode } = toolOption ?? { }

  const handleToolSelect = useCallback((toolId: string) => {
    dispatch(MapViewEvents.toolSelected(toolId))
  }, [dispatch])

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
        extents={extents}
        panAndZoomMode={panAndZoomMode ?? 'none'}
        style={{ flex: 1 }}
      >
        <MapContent>
          {SelectedTool && <SelectedTool dispatchViewEvent={dispatchViewEvent} viewState={state} />}
          {children}
        </MapContent>
      </Canvas>
    </View>
  )
}

const MapContent = ({ children }: PropsWithChildren<any>) => {
  const { extents } = useViewport()

  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const createAvatarRenderProps = useCallback((actor: Actor): AvatarAnimationProps => {
    return {
      actorId: actor.id,
      timeOffset: 0,
    }
  }, [])

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
      {children}
    </Svg>
  )
}

const container: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  alignContent: 'stretch',
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
