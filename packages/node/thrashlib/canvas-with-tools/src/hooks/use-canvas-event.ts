import { useContext, useEffect } from 'react'

import { CanvasEvents } from '../canvas-events'
import { CanvasContext } from '../context'

export const useCanvasEvent = <
  TEvent extends keyof CanvasEvents
>(type: TEvent, handler: CanvasEvents[TEvent]) => {
  const { emit } = useContext(CanvasContext)

  useEffect(() => {
    emit.on(type, handler)
    return () => {
      emit.removeListener(type, handler)
    }
  }, [emit, handler, type])
}
