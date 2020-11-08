import { find, matches } from 'lodash/fp'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Area, getArea } from '@thrashplay/gemstone-map-model'
import { NO_DECORATORS } from '@thrashplay/gemstone-map-ui'
import { useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { ViewEventDispatch } from '../dispatch-view-event'
import { MapView } from '../map-view/map-view'
import { ToolOption } from '../map-view/tool-option'

import { SelectionIndicator } from './decorators/selection-indicator'
import { MapEditorViewEvent, MapEditorViewEvents } from './events'
import { MapEditorViewState } from './state'
import { ToolOptions } from './tools'

export interface MapEditorMapProps extends MapEditorViewState, WithViewStyles<'style'> {
  /** dispatch function for sending view events */
  dispatch: ViewEventDispatch<MapEditorViewEvent>

  /** the ID of the selected area, or undefined if none */
  selectedAreaId?: Area['id']
}

/** Component responsible for rendering combat-specific content on top of an area map. */
export const MapEditorMap = ({
  dispatch,
  style,
  ...props
}: MapEditorMapProps) => {
  const {
    extents,
    selectedAreaId,
    selectedToolId,
  } = props

  const SelectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(ToolOptions) as ToolOption | undefined
    return option
  }, [selectedToolId])

  const handleToolSelected = useCallback((toolId: string) => {
    dispatch(MapEditorViewEvents.toolSelected(toolId))
  }, [dispatch])

  const getAreaDecorators = useCallback((areaId: Area['id']) => {
    return areaId === selectedAreaId
      ? SelectionIndicator
      : NO_DECORATORS
  }, [selectedAreaId])

  return (
    <View style={[styles.container, style]}>
      <MapView
        extents={extents}
        getMapAreaDecorators={getAreaDecorators}
        onToolSelected={handleToolSelected}
        selectedToolId={selectedToolId}
        toolOptions={ToolOptions}
      >
        {SelectedTool && <SelectedTool.component dispatchViewEvent={dispatch} viewState={props} />}
      </MapView>
    </View>
  )
}
const container: ViewStyle = {
}

const styles = StyleSheet.create({
  container,
})
