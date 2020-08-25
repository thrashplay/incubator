import { useCallback, useEffect, useReducer } from 'react'

import { Dimensions, DragEvent, Extents, ToolEvent, ToolProps, XY, ZoomEvent } from './types'
import { useCanvasEvent } from './use-canvas-event'

export interface PanAndZoomState {
  extents: Extents
  firstRender: boolean
  pan: XY
  scale: number
  viewport: Dimensions
}

export type PanAndZoom = ToolEvent<'canvas/pan-and-zoom', Omit<PanAndZoomState, 'viewport'>>

type Pan = ToolEvent<'pan', XY>
type SetViewport = ToolEvent<'set-viewport', Dimensions>
type Zoom = ToolEvent<'zoom', {
  x: number
  y: number
  zoomFactor: number
}>

const calculateExtents = (pan: XY, scale: number, viewport: Dimensions): Extents => {
  return {
    x: -pan.x / scale,
    y: -pan.y / scale,
    width: viewport.width * (1 / scale),
    height: viewport.height * (1 / scale),
  }
}

const initialize = (extents: Extents, viewport: Dimensions) => {
  if (viewport.width === 0 || viewport.height === 0) {
    return {
      extents,
      firstRender: true,
      pan: { x: 0, y: 0 },
      scale: 1,
      viewport,
    }
  } else {
    const scaleX = viewport.width / extents.width
    const scaleY = viewport.height / extents.height
    const scale = Math.min(scaleX, scaleY)

    const panX = extents.x * scale
    const panY = extents.y * scale

    return {
      extents,
      firstRender: true,
      pan: {
        x: panX,
        y: panY,
      },
      scale: scale,
      viewport,
    }
  }
}

const reducer = (state: PanAndZoomState, action: Pan | SetViewport | Zoom) => {
  let result = state
  switch (action.type) {
    case 'pan':
      result = {
        ...state,
        pan: {
          x: state.pan.x + action.payload.x,
          y: state.pan.y + action.payload.y,
        },
      }
      break

    case 'set-viewport':
      result = initialize(state.extents, action.payload)
      break

    case 'zoom': {
      const newScale = state.scale * action.payload.zoomFactor
      result = {
        ...state,
        pan: {
          x: action.payload.x - ((action.payload.x - state.pan.x) * newScale / state.scale),
          y: action.payload.y - ((action.payload.y - state.pan.y) * newScale / state.scale),
        },
        scale: newScale,
      }
    }
  }

  result.extents = calculateExtents(result.pan, result.scale, result.viewport)

  return {
    ...result,
    extents: calculateExtents(result.pan, result.scale, result.viewport),
    firstRender: false,
  }
}

export const PanAndZoomTool = ({
  extents,
  onToolEvent,
  viewport,
}: ToolProps<PanAndZoom>) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialize(extents, viewport))

  // update the viewport state, if this is not our first render (otherwise initialize handles it)
  useEffect(() => {
    if (!state.firstRender) {
      dispatch({
        type: 'set-viewport',
        payload: viewport,
      })
    }
  }, [state.firstRender, viewport])

  // if our state has changed, dispatch pan-and-zoom tool event
  useEffect(() => {
    if (!state.firstRender) {
      onToolEvent({
        type: 'canvas/pan-and-zoom',
        payload: state,
      })
    }
  }, [onToolEvent, state])

  const handleDrag = useCallback((event: DragEvent) => {
    dispatch({
      type: 'pan',
      payload: {
        x: event.dx,
        y: event.dy,
      },
    })
  }, [dispatch])

  // https://stackoverflow.com/a/30992764/517254
  const handleZoom = useCallback(({ x, y, zoomFactor }: ZoomEvent) => {
    dispatch({
      type: 'zoom',
      payload: {
        x,
        y,
        zoomFactor,
      },
    })
  }, [dispatch])

  useCanvasEvent('drag', handleDrag)
  useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
