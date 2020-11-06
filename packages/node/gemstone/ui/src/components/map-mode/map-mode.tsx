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

import { MapView } from '../map-view'
import { AvatarAnimation, AvatarAnimationProps } from '../map-view/avatar-animation'

export type MoveActionHandler = (x: number, y: number) => void

export interface ToolOption {
  icon: string
  id: string

  /** the pan/zoom mode to enable while using this tool, defaults to 'none' */
  panAndZoomMode?: PanAndZoomMode
}

export interface MapModeProps extends WithFrameQuery, WithViewStyles<'style'> {
  /** React nodes to render as overlays on top of the rendered map */
  children?: React.ReactNode | React.ReactNode[]

  /** extents for the map view, defaults to [0, 0]-[500, 500] */
  extents?: Extents

  onToolSelect?: (toolId: string) => void

  /** the ID of the currently selected tool */
  selectedToolId: string

  /** set of tools available for this view */
  toolOptions?: readonly ToolOption[]
}

export const MapMode = ({
  children = null,
  extents,
  onToolSelect = noop,
  selectedToolId,
  style,
  toolOptions = [],
}: MapModeProps) => {
  const selectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(toolOptions) as ToolOption | undefined
    return option
  }, [selectedToolId, toolOptions])

  const { panAndZoomMode } = selectedTool ?? { }

  return (
    <View style={[styles.container, style]}>
      {!isEmpty(toolOptions) && (
        <ToolSelectorButtonBar
          onSelect={onToolSelect}
          options={toolOptions}
          selectedId={selectedToolId}
        />
      )}

      <MapView
        extents={extents}
        panAndZoomMode={panAndZoomMode ?? 'none'}
        style={{ flex: 1 }}
      >
        {children}
      </MapView>
    </View>
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
