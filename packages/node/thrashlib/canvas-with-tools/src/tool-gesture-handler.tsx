import { debounce, isNil, noop } from 'lodash'
import React, { PropsWithChildren, SyntheticEvent, useCallback, useRef } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'

import { Dimensions, DragEvent, Extents, TapEvent, XY, ZoomEvent } from './types'

export interface ToolGestureHandlerProps {
  extents: Extents
  onDrag?: (event: DragEvent) => void
  onDragComplete?: (event: DragEvent) => void
  onDragStart?: (event: DragEvent) => void
  onTap?: (event: TapEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomComplete?: (event: ZoomEvent) => void
  onZoomStart?: (event: ZoomEvent) => void
  viewport: Dimensions
}

const WHEEL_DEBOUNCE_DELAY = 100

const NO_ZOOM = 1
const NO_DRAG = {
  x: 0,
  y: 0,
}

export const ToolGestureHandlerComponent: React.FC<PropsWithChildren<ToolGestureHandlerProps>> = ({
  children,
  extents,
  onDrag = noop,
  onDragComplete = noop,
  onDragStart = noop,
  onTap = noop,
  onZoom = noop,
  onZoomComplete = noop,
  onZoomStart = noop,
  viewport,
}, ref) => {
  // the drag accumulates over time from when the gesture started;
  // we use the accumulator to get the delta since the last event
  const dragAccumulator = useRef(NO_DRAG)
  const zoomAccumulator = useRef(1)
  const mouseDownPosition = useRef(null as null | XY)
  const isMouseZooming = useRef(false)
  const panRef = useRef<PanGestureHandler>(null)
  const extentsRef = useRef(extents)
  const viewportRef = useRef(viewport)

  extentsRef.current = extents
  viewportRef.current = viewport

  // ////////////////////////
  // Basic Tap Handling
  // ////////////////////////

  const handleTapStateChange = useCallback((event: TapGestureHandlerGestureEvent) => {
    const { nativeEvent } = event
    const { state, x, y } = nativeEvent

    if (state === State.ACTIVE) {
      onTap({
        extents: extentsRef.current,
        viewport: viewportRef.current,
        x,
        y,
      })
    }
  }, [onTap])

  // ////////////////////////
  // Pan Handling
  // ////////////////////////

  const handleDrag = useCallback((
    handler: (event: DragEvent) => void,
    nativeEvent: { translationX: number; translationY: number; x: number; y: number }
  ) => {
    const { translationX, translationY, x, y } = nativeEvent

    const previous = dragAccumulator.current
    dragAccumulator.current = { x: translationX, y: translationY }

    handler({
      dx: translationX - previous.x,
      dy: translationY - previous.y,
      extents: extentsRef.current,
      viewport: viewportRef.current,
      x,
      y,
    })
  }, [])

  const handlePanGesture = useCallback(({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    handleDrag(onDrag, nativeEvent)
  }, [handleDrag, onDrag])

  const handlePanStateChange = useCallback(({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    const {
      state,
      oldState,
    } = nativeEvent

    if (oldState === State.ACTIVE) {
      handleDrag(onDragComplete, nativeEvent)
      dragAccumulator.current = NO_DRAG
      mouseDownPosition.current = null
    } else if (state === State.ACTIVE) {
      // we want more accurate drag handling on web when a mouse is involved
      // so we fire an initial 'dragStart' event from where the mouse originally went down,
      // instead of starting where the pan gesture handler activates
      if (!isNil(mouseDownPosition.current)) {
        const { translationX, translationY, x, y } = nativeEvent
        handleDrag(onDragStart, {
          translationX: 0,
          translationY: 0,
          ...mouseDownPosition.current,
        })
        handleDrag(onDrag, {
          translationX: translationX + (x - mouseDownPosition.current.x),
          translationY: translationY + (y - mouseDownPosition.current.y),
          x: nativeEvent.x,
          y: nativeEvent.y,
        })
      } else {
        // start
        const { x, y } = nativeEvent
        dragAccumulator.current = { x, y }
        handleDrag(onDragStart, nativeEvent)
      }
    }
  }, [handleDrag, onDrag, onDragComplete, onDragStart])

  const handleMouseDown = useCallback(({ nativeEvent: { offsetX, offsetY } }: SyntheticEvent<Element, MouseEvent>) => {
    mouseDownPosition.current = { x: offsetX, y: offsetY }
  }, [mouseDownPosition])

  // ////////////////////////
  // Shared Zoom Handling
  // ////////////////////////

  const createZoomEvent = (zoomFactor: number, x = 0, y = 0): ZoomEvent => ({
    extents: extentsRef.current,
    viewport: viewportRef.current,
    x,
    y,
    zoomFactor,
  })

  const handleZoom = useCallback((
    handler: (event: ZoomEvent) => void,
    x: number,
    y: number,
    zoomFactor: number
  ) => {
    const previous = zoomAccumulator.current
    zoomAccumulator.current = zoomFactor

    handler({
      extents: extentsRef.current,
      viewport: viewportRef.current,
      x,
      y,
      zoomFactor: zoomFactor / previous,
    })
  }, [])

  // ////////////////////////
  // Pinch Handling
  // ////////////////////////

  const handlePinchGesture = useCallback(({ nativeEvent }: PinchGestureHandlerGestureEvent) => {
    const { focalX, focalY, scale } = nativeEvent
    handleZoom(onZoom, focalX, focalY, scale)
  }, [handleZoom, onZoom])

  const handlePinchStateChange = useCallback(({ nativeEvent }: PinchGestureHandlerStateChangeEvent) => {
    const {
      state,
      oldState,
      focalX,
      focalY,
      scale,
    } = nativeEvent

    if (oldState === State.ACTIVE) {
      handleZoom(onZoomComplete, focalX, focalY, scale)
      zoomAccumulator.current = NO_ZOOM
    } else if (state === State.ACTIVE) {
      handleZoom(onZoomStart, focalX, focalY, scale)
    }
  }, [handleZoom, onZoomComplete, onZoomStart])

  // ////////////////////////
  // Mouse Handling Bridges
  // ////////////////////////

  const rawStopMousewheelZooming = useCallback(() => {
    isMouseZooming.current = false
    onZoomComplete(createZoomEvent(1))
  }, [onZoomComplete])
  const stopMousewheelZooming = useRef(debounce(rawStopMousewheelZooming, WHEEL_DEBOUNCE_DELAY)).current

  const handleWheel = useCallback(({
    nativeEvent: { deltaY, offsetX: x, offsetY: y },
  }: SyntheticEvent<Element, WheelEvent>) => {
    const zoomFactor = deltaY < 0
      ? 1.1
      : deltaY > 0
        ? 0.9
        : 1

    // simulate a full sequence of pinch events
    if (!isMouseZooming.current) {
      onZoomStart(createZoomEvent(zoomFactor, x, y))
      isMouseZooming.current = true
    } else {
      onZoom(createZoomEvent(zoomFactor, x, y))
    }
  }, [onZoom, onZoomStart])

  // if the mousewheel is scrolling, try to stop it
  // this is debounced, so will be delayed until MapState stops changing
  if (isMouseZooming.current) {
    stopMousewheelZooming()
  }

  return (
    // coordinates are always undefined in tap events
    <TapGestureHandler
      onHandlerStateChange={handleTapStateChange}
      maxDurationMs={10000}
    >
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={handlePanGesture}
        onHandlerStateChange={handlePanStateChange}
        minDist={0}
        maxPointers={2}
        avgTouches={true}
      >
        <View
          style={styles.wrapper}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onMouseDown={handleMouseDown}
        >
          <PinchGestureHandler
            onHandlerStateChange={handlePinchStateChange}
            onGestureEvent={handlePinchGesture}
            simultaneousHandlers={panRef}
          >
            <View
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onWheel={handleWheel}
              ref={ref}
              style={styles.wrapper}
            >
              {children}
            </View>
          </PinchGestureHandler>
        </View>
      </PanGestureHandler>
    </TapGestureHandler>
  )
}

const wrapper: ViewStyle = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
}

const styles = StyleSheet.create({
  wrapper,
})

export const ToolGestureHandler =
  React.forwardRef<View, PropsWithChildren<ToolGestureHandlerProps>>(ToolGestureHandlerComponent)
