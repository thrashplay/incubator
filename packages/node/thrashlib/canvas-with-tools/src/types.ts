import { ComponentType } from 'react'
import TypedEmitter from 'typed-emitter'

/** tool types */
export interface ToolEvent<TType extends string = string, TPayload extends any = any> {
  payload: TPayload
  type: TType
}

export type ToolEventHandler<TEvent extends ToolEvent> = (event: TEvent) => void

export type SetViewportEvent = ToolEvent<'viewport/set', Dimensions>

/** View data types */
export type XY = { x: number; y: number }
export type Point = XY
export type Dimensions = {
  width: number
  height: number
}
export type Extents = Point & Dimensions

/* Canvas event types */
export interface DragEvent {
  dx: number
  dy: number
  x: number
  y: number
}

export interface TapEvent {
  x: number
  y: number
}

export interface ZoomEvent {
  zoomFactor: number
  x: number
  y: number
}

export type DragListener = (event: DragEvent) => void
export type TapListener = (event: TapEvent) => void
export type ZoomListener = (event: ZoomEvent) => void

export interface CanvasEvents {
  drag: DragListener
  tap: TapListener
  zoom: ZoomListener
}
export type CanvasEventEmitter = TypedEmitter<CanvasEvents>

export type ContentViewProps<TData extends any> = Record<string, unknown> & TData extends undefined
  ? {
    /** current canvas extents, in world coordinates */
    extents: Extents

    /** the current pan values for the canvas */
    // pan: { x: number; y: number }

    /** the current scale value for the canvas */
    // scale: number

    /** the size of the canvas viewport, in screen coordinates */
    viewport: Dimensions
  }
  : {
    /** additional, canvas-specific data that is passed to tools and canvas components */
    data: TData

    /** current canvas extents, in world coordinates */
    extents: Extents

    /** the current pan values for the canvas */
    // pan: { x: number; y: number }

    /** the current scale value for the canvas */
    // scale: number

    /** the size of the canvas viewport, in screen coordinates */
    viewport: Dimensions
  }

export type ToolProps<TEvent extends ToolEvent, TData extends any = any> = ContentViewProps<TData> & {
  /** emitter for all canvas interacton events */
  canvasEvents: CanvasEventEmitter

  /** a function used by tools to trigger app-specific updates to the canvas data */
  onToolEvent: ToolEventHandler<TEvent>
}

export type ToolComponent<
  TToolEvent extends ToolEvent = ToolEvent,
  TData extends any = any,
> = ComponentType<ToolProps<TToolEvent, TData>>
