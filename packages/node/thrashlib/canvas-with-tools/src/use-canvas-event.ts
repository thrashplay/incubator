import { useContext, useEffect } from 'react'

import { CanvasEventContext } from './canvas'
import { CanvasEvents } from './canvas-events'

export const useCanvasEvent = <
  TEvent extends keyof CanvasEvents
>(type: TEvent, handler: CanvasEvents[TEvent]) => {
  const canvasEvents = useContext(CanvasEventContext)

  useEffect(() => {
    canvasEvents.on(type, handler)
    return () => {
      canvasEvents.removeListener(type, handler)
    }
  }, [canvasEvents, handler, type])
}
