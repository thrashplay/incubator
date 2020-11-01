import { EventEmitter } from 'keyv'
import { isNil, noop } from 'lodash'
import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Dimensions, Extents } from '@thrashplay/geometry'

import { CanvasEventEmitter, DragEvent, TapEvent, ZoomEvent } from './canvas-events'
import { ContentViewProps } from './content-view-props'
import { ToolProps } from './tool-component'
import { ToolEvent } from './tool-events'
import { ToolGestureHandler } from './tool-gesture-handler'

export type CanvasProps<
  TData extends any,
  TToolEvent extends ToolEvent
> =
  TData extends undefined ? unknown : { data: TData } &
  Partial<Pick<ToolProps<TToolEvent, TData>, 'toolEventDispatch'>> & {
    children: React.ComponentType<ContentViewProps<TData>>
    extents: Extents
    onViewportChange?: (viewport: Dimensions) => void
    selectedTool?: (props: ToolProps<any, TData>) => ReactElement | null
    style?: StyleProp<ViewStyle>
  }

export const CanvasEventContext = React.createContext(new EventEmitter() as CanvasEventEmitter)

export const Canvas = <
  TData extends any,
  TToolEvent extends ToolEvent
>({
  children,
  data,
  extents,
  toolEventDispatch = noop,
  onViewportChange = noop,
  selectedTool,
  style,
}: CanvasProps<TData, TToolEvent>) => {
  const ChildContent = children
  const ActiveTool = selectedTool

  const eventEmitter = useRef(new EventEmitter() as CanvasEventEmitter)

  const [viewport, setViewport] = useState({ width: 0, height: 0 } as Dimensions)

  const handleLayout = (event: LayoutChangeEvent) => {
    const newViewport = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    }

    setViewport(newViewport)
    onViewportChange(newViewport)
  }

  const handleDrag = useCallback((event: DragEvent) => eventEmitter.current.emit('drag', event), [])
  const handleTap = useCallback((event: TapEvent) => eventEmitter.current.emit('tap', event), [])
  const handleZoom = useCallback((event: ZoomEvent) => eventEmitter.current.emit('zoom', event), [])

  // ////////////////////////
  // tool event listener management
  // ////////////////////////

  return (
    // outer view is for user styles, inner view is for measuring
    // this let's padding and other things correctly reduce content size
    <View
      collapsable={false}
      style={style}
    >
      <View
        collapsable={false}
        onLayout={handleLayout}
        style={styles.fillParent}
      >
        {viewport.width > 0 && viewport.height > 0 && !isNil(extents) && (
          <ChildContent
            data={data}
            extents={extents}
            viewport={viewport}
            {...data}
          />
        )}

        {ActiveTool && viewport.width > 0 && viewport.height > 0 && !isNil(extents) && (
          <CanvasEventContext.Provider value={eventEmitter.current}>
            <ToolGestureHandler
              extents={extents}
              onDrag={handleDrag}
              onTap={handleTap}
              onZoom={handleZoom}
              viewport={viewport}
            />
            <ActiveTool
              data={data}
              extents={extents}
              toolEventDispatch={toolEventDispatch}
              viewport={viewport}
            />
          </CanvasEventContext.Provider>
        )}
      </View>
    </View>
  )
}

const fillParent: ViewStyle = {
  flex: 1,
  alignSelf: 'stretch',
}

export const styles = StyleSheet.create({
  fillParent,
})
