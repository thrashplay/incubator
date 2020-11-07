import React, { useCallback, useEffect, useReducer } from 'react'
import { StyleSheet, View } from 'react-native'

import { Area, getAreas } from '@thrashplay/gemstone-map-model'
import { useValue } from '@thrashplay/gemstone-ui-core'
import { Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { LayoutStyles } from '../../styles'

import { AreaInspectPanel } from './area-inspect-panel'
import { AreaList } from './area-list'
import { MapEditorViewEvents } from './events'
import { MapEditorMap } from './map-editor-map'
import { reducer } from './reducer'
import { DEFAULT_EXTENTS, INITIAL_STATE } from './state'

export interface MapEditorViewProps extends WithViewStyles<'style'> {
  /** extents for the map view, defaults to [-250, -250]-[250, 250] */
  extents?: Extents
}

export const MapEditorView = ({
  extents: initialExtents,
  style,
}: MapEditorViewProps) => {
  const areas = useValue(getAreas)

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const { selectedAreaId } = state

  useEffect(() => {
    dispatch(MapEditorViewEvents.extentsChanged(initialExtents ?? DEFAULT_EXTENTS))
  }, [dispatch, initialExtents])

  const handleSelectArea = useCallback((areaId: Area['id']) => {
    dispatch(MapEditorViewEvents.areaSelected(areaId))
  }, [dispatch])

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sidebar}>
        <AreaList
          areas={areas}
          onSelect={handleSelectArea}
          selectedAreaId={selectedAreaId}
          style={styles.sidebarList}
          title="Map Areas"
        />
        {selectedAreaId && (
          <AreaInspectPanel
            areaId={selectedAreaId}
            style={styles.sidebarDetails}
          />)}
      </View>
      <MapEditorMap
        dispatch={dispatch}
        style={styles.mapView}
        {...state}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  ...LayoutStyles,
})
