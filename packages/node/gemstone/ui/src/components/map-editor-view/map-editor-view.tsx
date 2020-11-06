import React, { useEffect, useReducer } from 'react'
import { View } from 'react-native'

import { Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { ActorInspectPanel } from '../combat-view/actor-inspect-panel'
import { ActorList } from '../combat-view/actor-list'
import { LayoutStyles } from '../layout-styles'

import { MapEditorViewEvents } from './events'
import { MapAreaInspectPanel } from './map-editor-inspect-panel'
import { MapEditorMap } from './map-editor-map'
import { reducer } from './reducer'
import { DEFAULT_EXTENTS, INITIAL_STATE } from './state'

export interface MapEditorViewProps extends WithViewStyles<'style'> {
  /** extents for the map view, defaults to [0, 0]-[500, 500] */
  extents?: Extents
}

export const MapEditorView = ({
  extents: initialExtents,
  style,
}: MapEditorViewProps) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const { selectedAreaId } = state

  useEffect(() => {
    dispatch(MapEditorViewEvents.extentsChanged(initialExtents ?? DEFAULT_EXTENTS))
  }, [dispatch, initialExtents])

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sidebar}>
        {selectedAreaId && (
          <MapAreaInspectPanel
            areaId={selectedAreaId}
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

const styles = {
  ...LayoutStyles,
}
