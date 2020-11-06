import { noop } from 'lodash'
import { find, flow, isEmpty, map, matches } from 'lodash/fp'
import React, { PropsWithChildren, useCallback, useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Svg } from 'react-native-svg'

import { Canvas, useViewport } from '@thrashplay/canvas-with-tools'
import { AreasRenderer, Grid } from '@thrashplay/gemstone-map-ui'
import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue, WithFrameQuery } from '@thrashplay/gemstone-ui-core'
import { Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { ViewEvent } from '../dispatch-view-event'

import { AvatarAnimation, AvatarAnimationProps } from './avatar-animation'
import { ToolOption } from './tool-option'

export interface MapViewProps<
  TViewState extends unknown = any,
  TViewEvent extends ViewEvent = any
> extends WithFrameQuery, WithViewStyles<'style'> {
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
  extents,
  onToolSelected = noop,
  selectedToolId,
  style,
  toolOptions = [],
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
        <MapContent>
          {children}
        </MapContent>
      </Canvas>
    </View>
  )
}

const MapContent = ({ children }: PropsWithChildren<any>) => {
  const { extents, viewport } = useViewport()
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
      height={viewport.height}
      viewBox={`${extents.x} ${extents.y} ${extents.width} ${extents.height}`}
      width={viewport.width}
    >
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

const canvas: ViewStyle = {
  alignContent: 'stretch',
  backgroundColor: 'black',
  flex: 1,
  flexDirection: 'row',
  marginBottom: 0,
  marginTop: 4,
}

const container: ViewStyle = {
  flex: 1,
}

const toolSelector: ViewStyle = {
  backgroundColor: '#ddd',
}

const styles = StyleSheet.create({
  canvas,
  container,
  toolSelector,
})
