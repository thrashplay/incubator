import { EventEmitter } from 'events'

import React from 'react'

import { Dimensions, Extents } from '@thrashplay/math'

import { CanvasEventEmitter } from './canvas-events'

export interface CanvasContextType {
  emit: CanvasEventEmitter
  extents: Extents
  viewport: Dimensions
}

export const CanvasContext = React.createContext<CanvasContextType>({
  emit: new EventEmitter() as CanvasEventEmitter,
  extents: { x: 0, y: 0, width: 0, height: 0 },
  viewport: { width: 0, height: 0 },
})
