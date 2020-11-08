import { noop } from 'lodash'
import { find, isEmpty, matches } from 'lodash/fp'
import React, { useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Canvas } from '@thrashplay/canvas-with-tools'
import { Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { getDefaultActorDecorators as getDefaultActorDecoratorsImpl } from '../actor-decorators'
import { getDefaultMapAreaDecorators as getDefaultMapAreaDecoratorsImpl } from '../area-decorators'
import { ViewEvent } from '../dispatch-view-event'

import { MapContent, MapContentProps } from './map-content'
import { ToolOption } from './tool-option'

export interface MapViewProps<
  TViewState extends unknown = any,
  TViewEvent extends ViewEvent = any
> extends WithViewStyles<'style'>, MapContentProps {
  /** React nodes to render as overlays (tools and content) on top of the rendered map */
  children?: React.ReactNode | React.ReactNode

  /** extents for the map view */
  extents: Extents

  /** optional callback notified when a new tool is selected */
  onToolSelected?: (toolId: string) => void

  /** the ID of the currently selected tool */
  selectedToolId: string

  /** set of tools available for this view */
  toolOptions?: readonly ToolOption<TViewState, TViewEvent>[]
}

export const MapView = <TViewEvent extends ViewEvent = any>({
  children = null,
  getDefaultActorDecorators = getDefaultActorDecoratorsImpl,
  getDefaultMapAreaDecorators = getDefaultMapAreaDecoratorsImpl,
  extents,
  onToolSelected = noop,
  selectedToolId,
  style,
  toolOptions = [],
  ...otherContentProps
}: MapViewProps<TViewEvent>) => {
  const toolOption = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(toolOptions) as ToolOption | undefined
    return option
  }, [selectedToolId, toolOptions])

  return (
    <View style={[styles.container, style]}>
      {!isEmpty(toolOptions) && (
        <ToolSelectorButtonBar
          onSelect={onToolSelected}
          options={toolOptions}
          selectedId={selectedToolId}
          style={styles.toolSelector}
        />
      )}

      <Canvas
        extents={extents}
        panAndZoomMode={toolOption?.panAndZoomMode ?? 'none'}
        style={styles.canvas}
      >
        <MapContent
          {...otherContentProps}
          getDefaultActorDecorators={getDefaultActorDecorators}
          getDefaultMapAreaDecorators={getDefaultMapAreaDecorators}
        >
          {children}
        </MapContent>
      </Canvas>
    </View>
  )
}

const canvas: ViewStyle = {
  alignContent: 'stretch',
  backgroundColor: '#396',
  flex: 1,
  marginBottom: 0,
  marginTop: 4,
}

const container: ViewStyle = {
  flex: 1,
}

const toolSelector: ViewStyle = {
  backgroundColor: '#eee',
  borderColor: '#ccc',
  borderWidth: 1,
}

const styles = StyleSheet.create({
  canvas,
  container,
  toolSelector,
})
