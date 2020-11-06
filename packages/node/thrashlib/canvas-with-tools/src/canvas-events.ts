import TypedEmitter from 'typed-emitter'

import { Dimensions, Extents } from '@thrashplay/math'

/* Canvas event types */
export interface CanvasEvent {
  extents: Extents
  viewport: Dimensions
}

export interface DragEvent extends CanvasEvent {
  dx: number
  dy: number
  x: number
  y: number
}

export interface TapEvent extends CanvasEvent {
  x: number
  y: number
}

export interface ZoomEvent extends CanvasEvent {
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
