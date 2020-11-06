import { EventEmitter } from 'keyv'
import { isNil, noop } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Dimensions, Extents } from '@thrashplay/math'

import { adjustExtentsForViewport } from './adjust-extents-for-viewport'
import { CanvasEventEmitter, DragEvent, TapEvent, ZoomEvent } from './canvas-events'
import { CanvasContext } from './context'
import { ToolGestureHandler } from './tool-gesture-handler'
import { PanTool } from './tools/pan'
import { PanAndZoomTool } from './tools/pan-and-zoom'
import { ZoomTool } from './tools/zoom'

export type PanAndZoomMode = 'none' | 'pan' | 'pan-and-zoom' | 'zoom'

export interface CanvasProps {
  children: React.ReactNode | React.ReactNode[]
  extents: Extents
  onExtentsChanged?: (extents: Extents) => void
  onViewportChanged?: (viewport: Dimensions) => void
  panAndZoomMode?: PanAndZoomMode
  style?: StyleProp<ViewStyle>
}

export const Canvas = ({
  children,
  extents: extentsFromProps,
  onExtentsChanged = noop,
  onViewportChanged = noop,
  panAndZoomMode = 'pan-and-zoom',
  style,
}: CanvasProps) => {
  const eventEmitter = useRef(new EventEmitter() as CanvasEventEmitter)

  const [viewport, setViewport] = useState({ width: 0, height: 0 } as Dimensions)
  const [extents, setExtents] = useState(extentsFromProps)

  useEffect(() => {
    setExtents(extentsFromProps)
  }, [extentsFromProps])

  const handleLayout = (event: LayoutChangeEvent) => {
    const newViewport = {
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    }

    const newExtents = adjustExtentsForViewport(extents, viewport, newViewport)

    setViewport(newViewport)
    onViewportChanged(newViewport)
    handleExtentsChange(newExtents)
  }

  const handleDrag = useCallback((event: DragEvent) => eventEmitter.current.emit('drag', event), [])
  const handleTap = useCallback((event: TapEvent) => eventEmitter.current.emit('tap', event), [])
  const handleZoom = useCallback((event: ZoomEvent) => eventEmitter.current.emit('zoom', event), [])

  const handleExtentsChange = useCallback((newExtents: Extents) => {
    setExtents(newExtents)
    onExtentsChanged(newExtents)
  }, [onExtentsChanged, setExtents])

  const renderPanToolIfEnabled = () =>
    panAndZoomMode === 'pan' && <PanTool onExtentsChanged={handleExtentsChange} />

  const renderPanAndZoomToolIfEnabled = () =>
    panAndZoomMode === 'pan-and-zoom' && <PanAndZoomTool onExtentsChanged={handleExtentsChange} />

  const renderZoomToolIfEnabled = () =>
    panAndZoomMode === 'zoom' && <ZoomTool onExtentsChanged={handleExtentsChange} />

  const renderContent = () => (
    <>
      {children}
      {renderPanToolIfEnabled()}
      {renderZoomToolIfEnabled()}
      {renderPanAndZoomToolIfEnabled()}
    </>
  )

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
        <CanvasContext.Provider value={{
          emit: eventEmitter.current,
          extents,
          viewport,
        }}>
          <ToolGestureHandler
            extents={extents}
            onDrag={handleDrag}
            onTap={handleTap}
            onZoom={handleZoom}
            viewport={viewport}
          />
          {viewport.width > 0 && viewport.height > 0 && !isNil(extents) && renderContent()}
        </CanvasContext.Provider>
      </View>
    </View>
  )
}

const fillParent: ViewStyle = {
  flex: 1,
  alignItems: 'stretch',
}

export const styles = StyleSheet.create({
  fillParent,
})
