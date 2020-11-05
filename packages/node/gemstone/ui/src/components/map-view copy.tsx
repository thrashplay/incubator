import { isEmpty } from 'lodash'
import { find, flow, get, map, matches } from 'lodash/fp'
import React, { ReactElement, useCallback, useMemo, useReducer } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { CommonPathProps, Rect, Svg } from 'react-native-svg'

import { Canvas, ContentViewProps, ToolProps } from '@thrashplay/canvas-with-tools'
import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue, WithFrameQuery } from '@thrashplay/gemstone-ui-core'
import { Dimensions, Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { AvatarAnimation, AvatarAnimationProps } from './scene/avatar-animation'
import { INITIAL_STATE, reducer } from './scene/state'

const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
}

const SELECTED_MAP_AREA_STYLES: CommonPathProps = {
  fillOpacity: 0,
  stroke: 'red',
  strokeOpacity: 1,
  strokeWidth: 2,
}

export interface ToolOption<TData extends any = any> {
  component: (props: ToolProps<any, TData>) => ReactElement | null
  icon: string
  id: string
}

export type MoveActionHandler = (x: number, y: number) => void

export interface MapViewProps<TData extends any = any> extends WithFrameQuery, WithViewStyles<'style'> {
  /** extents for the map view, defaults to [0, 0]-[1000, 1000] */
  extents?: Extents

  /** render prop for a mode-specific overlay to the map */
  overlay?: (props: ContentViewProps<TData>) => React.ReactNode

  /** set of tools available for this map */
  toolOptions?: ToolOption<TData>[]
}
export const MapView = <TData extends any = any>({
  extents: initialExtents = DEFAULT_EXTENTS,
  style,
  toolOptions = [],
}: MapViewProps<TData>) => {
  // zoom to full extents the when the map is first displayed
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => ({
    ...initialState,
    extents: initialExtents,
  }))

  const { extents, selectedToolId } = state

  const selectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(toolOptions) as typeof toolOptions[number] | undefined
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

  return (
    <View style={[styles.container, style]}>
      {!isEmpty(toolOptions) && (
        <ToolSelectorButtonBar
          onSelect={handleToolSelect}
          options={toolOptions}
          selectedId={selectedToolId}
        />
      )}

      <Canvas
        data={{} as TData}
        extents={extents}
        toolEventDispatch={dispatch}
        onViewportChange={handleViewportChange}
        selectedTool={selectedTool}
        // style={{ flex: 1 }}
      >
        {/* {MapContent} */}
      </Canvas>
    </View>
  )
}

const MapContent = ({
  extents,
}: ContentViewProps<any>) => {
  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const createAvatarRenderProps = useCallback((actor: Actor): AvatarAnimationProps => {
    const position = actor.status.position
    return {
      actor,
      x: position.x,
      y: position.y,
    }
  }, [])

  const renderAvatars = useCallback(() => flow(
    map(createAvatarRenderProps),
    map((props: AvatarAnimationProps) => <AvatarAnimation key={props.actor.id} {...props} />)
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
      {children}
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
