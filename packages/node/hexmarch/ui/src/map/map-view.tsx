import { isNil, map } from 'lodash'
import React, { useCallback, useMemo, useReducer } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { ToggleButton } from 'react-native-paper'
import Svg, { Circle, Line, Rect } from 'react-native-svg'

import { Canvas, ContentViewProps, Dimensions } from '@thrashplay/canvas-with-tools'
import { MapData } from '@thrashplay/hexmarch-model'

import { LookAndFeel } from './look-and-feel'
import { DefaultLookAndFeel } from './look-and-feels'
import { INITIAL_STATE, MapViewAction, reducer } from './state'
import { BasicPointerTool } from './tools'
import { ToolName } from './types'

export interface MapViewProps {
  lookAndFeel?: LookAndFeel
  map: MapData
  style?: StyleProp<ViewStyle>
}

export const MapView = ({
  lookAndFeel = DefaultLookAndFeel,
  map: mapData,
  style,
}: MapViewProps) => {
  const { extents: mapExtents, layout, tiles } = mapData

  // zoom to full extents the when the map is first displayed
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => ({
    ...initialState,
    extents: mapExtents,
  }))

  const { extents, selectedTile, selectedToolName } = state

  const selectTool = useCallback((toolName?: string) => {
    dispatch({
      type: 'select-tool',
      payload: toolName as ToolName,
    })
  }, [dispatch])

  const ActiveTool = useMemo(() => {
    switch (selectedToolName) {
      case 'pointer':
        return BasicPointerTool

      default:
        return BasicPointerTool
    }
  }, [selectedToolName])

  const handleToolEvent = useCallback((event: MapViewAction) => {
    dispatch(event)
  }, [])

  const handleViewportChange = useCallback((viewport: Dimensions) => {
    dispatch({
      type: 'set-viewport',
      payload: viewport,
    })
  }, [])

  const mapShapes = useMemo(() => {
    const createSelectedTile = () => {
      if (isNil(selectedTile) || isNil(lookAndFeel.getSelectionRenderer)) {
        return null
      }

      const tileData = tiles.get([selectedTile.q, selectedTile.r])
      const Renderer = lookAndFeel.getSelectionRenderer(tileData)

      return (
        <Renderer
          key={'tile-selection'}
          mapLayout={layout}
          q={selectedTile.q}
          r={selectedTile.r}
        />
      )
    }

    const populatedTiles = map([...tiles.values()], (tile) => {
      const { q, r } = tile.coordinates

      const Renderer = lookAndFeel.getTileRenderer(tile)

      return (
        <Renderer
          key={`${q},${r}`}
          mapLayout={layout}
          q={q}
          r={r}
        />
      )
    })

    return [...populatedTiles, createSelectedTile()]
  }, [layout, lookAndFeel, selectedTile, tiles])

  const hexGridCanvasRenderer = useCallback(({
    extents,
  }: ContentViewProps<MapData>) => {
    return (
      <Svg viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}>
        {mapShapes}
        <Circle
          cx={0}
          cy={0}
          r={1}
        />
        <Line
          x1={0}
          y1={0}
          x2={0}
          y2={-6}
          strokeWidth={1}
          stroke="red"
        />
        <Line
          x1={0}
          y1={0}
          x2={0}
          y2={6}
          strokeWidth={1}
          stroke="green"
        />
      </Svg>
    )
  }, [mapShapes])

  return (
    <>
      <ToggleButton.Row
        onValueChange={selectTool}
        style={styles.toolbar}
        value={selectedToolName}
      >
        <ToggleButton
          icon="hand"
          value="pointer"
        />
      </ToggleButton.Row>
      <Canvas
        data={mapData}
        extents={extents}
        onViewportChange={handleViewportChange}
        style={style}
        selectedTool={ActiveTool}
        toolEventDispatch={handleToolEvent}
      >
        {hexGridCanvasRenderer}
      </Canvas>
    </>
  )
}

const toolbar: ViewStyle = {
  backgroundColor: '#ecf0f1',
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
  paddingVertical: 4,
}

const styles = StyleSheet.create({
  toolbar,
})
