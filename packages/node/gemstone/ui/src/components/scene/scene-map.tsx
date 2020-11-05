import { find, flow, get, map, matches } from 'lodash/fp'
import React, { useCallback, useMemo, useReducer } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { CommonPathProps, Rect, Svg } from 'react-native-svg'

import { Canvas, ContentViewProps } from '@thrashplay/canvas-with-tools'
import { Area, getArea } from '@thrashplay/gemstone-map-model'
import { AreaShape, AreasRenderer, Grid } from '@thrashplay/gemstone-map-ui'
import { Actor } from '@thrashplay/gemstone-model'
import { useValue, WithFrameQuery } from '@thrashplay/gemstone-ui-core'
import { Dimensions, Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { AvatarAnimation, AvatarAnimationProps } from './avatar-animation'
import { AvatarProps, DefaultAvatar } from './default-avatar'
import { INITIAL_STATE, reducer } from './state'
import { TOOL_OPTIONS } from './tools'

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

export interface SceneMapData extends Omit<SceneMapProps, 'extents'> {
  highlights: { [k in string]?: boolean }

  /** render function used to create Avatar elements */
  renderAvatar: (props: AvatarProps) => React.ReactNode

  /** ID of the map area currently selected */
  selectedMapAreaId?: Area['id']
}

export const SceneMap = ({
  actors = [],
  extents: initialExtents = DEFAULT_EXTENTS,
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

  const { extents, highlights, selectedMapAreaId, selectedToolId } = state

  const selectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(TOOL_OPTIONS) as typeof TOOL_OPTIONS[number] | undefined
    return option?.component
  }, [selectedToolId])

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
      <ToolSelectorButtonBar
        onSelect={handleToolSelect}
        options={TOOL_OPTIONS}
        selectedId={selectedToolId}
      />

      <Canvas
        data={{ actors, highlights, renderAvatar, selectedMapAreaId, style, selectedActor, timeOffset }}
        extents={extents}
        toolEventDispatch={dispatch}
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
  const { actors, highlights, renderAvatar, selectedActor, selectedMapAreaId, timeOffset } = data
  const selectedMapArea = useValue(getArea, { areaId: selectedMapAreaId })

  const createAvatarRenderProps = useCallback((actor: Actor): AvatarAnimationProps => {
    const position = actor.status.position
    return {
      actor,
      highlighted: get(actor.id)(highlights) === true,
      renderAvatar,
      selected: selectedActor?.id === actor.id,
      timeOffset,
      x: position.x,
      y: position.y,
    }
  }, [highlights, renderAvatar, selectedActor?.id, timeOffset])

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
      {/* <Things /> */}
      <AreasRenderer />
      <Grid
        gridSpacing={10}
        mapHeight={500}
        mapWidth={500}
      />
      {selectedMapArea && (
        <AreaShape
          {...SELECTED_MAP_AREA_STYLES}
          area={selectedMapArea}
        />
      )}
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
