import { isEqual } from 'lodash'
import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { applyToPoint, compose, inverse, scale, translate } from 'transformation-matrix'

import { calculateScale, CoordinateConverter } from './coordinate-helpers'
import { Dimensions, DragEvent, Extents, ToolEvent, ToolProps, XY, ZoomEvent } from './types'
import { useCanvasEvent } from './use-canvas-event'

export interface PanAndZoomState {
  extents: Extents
  needsDispatch: boolean
  pan: XY
  scale: number
  viewport: Dimensions
}

export type PanAndZoom = ToolEvent<'canvas/pan-and-zoom', { extents: Extents }>

type ClearExtentsChanged = ToolEvent<'clear-extents-changed'>
type Pan = ToolEvent<'pan', { dx: number; dy: number }>
type Reset = ToolEvent<'reset', { extents: Extents; viewport: Dimensions}>
type Zoom = ToolEvent<'zoom', {
  x: number
  y: number
  zoomFactor: number
}>

const calculateExtents = (pan: XY, scaleFactor: number, viewport: Dimensions): Extents => {
  // const matrix = inverse(compose(
  //   translate(pan.x, pan.y),
  //   scale(scaleFactor)
  // ))

  // const upperLeft = applyToPoint(matrix, { x: 0, y: 0 })
  // const lowerRight = applyToPoint(matrix, { x: viewport.width, y: viewport.height })

  // return {
  //   ...upperLeft,
  //   width: lowerRight.x - upperLeft.x,
  //   height: lowerRight.y - upperLeft.y,
  // }

  // throw new Error('dioed')

  const extents = {
    x: -pan.x / scaleFactor,
    y: -pan.y / scaleFactor,
    width: viewport.width * (1 / scaleFactor),
    height: viewport.height * (1 / scaleFactor),
  }

  return extents
}

const initialize = (extents: Extents, viewport: Dimensions) => {
  if (viewport.width === 0 || viewport.height === 0) {
    return {
      extents,
      needsDispatch: false,
      pan: { x: 0, y: 0 },
      scale: 1,
      viewport,
    }
  } else {
    const scale = calculateScale(extents, viewport)
    const panX = -extents.x * scale
    const panY = -extents.y * scale

    return {
      extents,
      needsDispatch: false,
      pan: {
        x: panX,
        y: panY,
      },
      scale: scale,
      viewport,
    }
  }
}

const reducer = (state: PanAndZoomState, action: ClearExtentsChanged | Pan | Reset | Zoom) => {
  let result: PanAndZoomState

  switch (action.type) {
    case 'clear-extents-changed':
      return {
        ...state,
        needsDispatch: false,
      }

    case 'pan':
      console.log('prev:', state.pan.x)
      console.log('prevS:', state.pan.x / state.scale)
      console.log('dx:', action.payload.dx)
      console.log('new:', state.pan.x + action.payload.dx)
      console.log('newS:', (state.pan.x + action.payload.dx) / state.scale)

      result = {
        ...state,
        needsDispatch: true,
        extents: {
          ...state.extents,
          x: state.extents.x - action.payload.x / state.scale,
          y: state.extents.y - action.payload.y / state.scale,
        },
        pan: {
          x: state.pan.x + action.payload.dx,
          y: state.pan.y + action.payload.dy,
        },
      }
      break

    case 'reset':
      return initialize(action.payload.extents, action.payload.viewport)

    case 'zoom': {
      // console.log('exies', state.extents)
      const { x, y, zoomFactor } = action.payload
      // const { x, zoomFactor } = action.payload
      // const x = state.viewport.width * 0.25
      // const y = state.viewport.height * 0.5
      const newScale = state.scale * zoomFactor
      // console.log('y', y)

      const newWidth = state.extents.width * zoomFactor
      const newHeight = state.extents.height * zoomFactor
      const xGrow = newWidth - state.extents.width
      const yGrow = newHeight - state.extents.height
      const xRatio = x / state.viewport.width
      const yRatio = y / state.viewport.height

      const coordinates = new CoordinateConverter(state.extents, state.viewport)
      const oldworld = coordinates.toWorld({ x, y })
      // console.log('orign:', oldworld.y)

      result = {
        ...state,
        needsDispatch: true,
        // extents: {
        //   x: state.extents.x - (xGrow * xRatio),
        //   y: state.extents.y - (yGrow * yRatio),
        //   width: newWidth,
        //   height: newHeight,
        // },
        pan: {
          x: x - ((x - state.pan.x) * newScale / state.scale),
          y: y - ((y - state.pan.y) * newScale / state.scale),
        },
        scale: newScale,
      }
    }
  }

  return {
    ...result,
    extents: calculateExtents(result.pan, result.scale, result.viewport),
  }
}

export const PanAndZoomTool = ({
  extents,
  onToolEvent,
  viewport,
}: ToolProps<PanAndZoom>) => {
  console.log('newT', extents)

  const [state, dispatch] = useReducer(reducer, undefined, () => initialize(extents, viewport))

  const scale = useMemo(() => calculateScale(extents, viewport), [extents, viewport])

  // update the viewport state, if this is not our first render (otherwise initialize handles it)
  // useEffect(() => {
  //   if (!isEqual(extents, state.extents) || !isEqual(viewport, state.viewport)) {
  //     dispatch({
  //       type: 'reset',
  //       payload: {
  //         extents,
  //         viewport,
  //       },
  //     })
  //   }
  // }, [extents, state, viewport])

  // if our state has changed, dispatch pan-and-zoom tool event
  // our reducer cannot update other component via a side effect, so this suffices
  // useEffect(() => {
  //   if (state.needsDispatch) {
  //     onToolEvent({
  //       type: 'canvas/pan-and-zoom',
  //       payload: state,
  //     })

  //     dispatch({ type: 'clear-extents-changed' })
  //   }
  // }, [onToolEvent, state])

  const handleDrag = useCallback((event: DragEvent) => {
    // dispatch({
    //   type: 'pan',
    //   payload: {
    //     dx: event.dx,
    //     dy: event.dy,
    //   },
    // })

    console.log('old:', extents.x)
    console.log('dp&ZT:', event.dx)

    onToolEvent({
      type: 'canvas/pan-and-zoom',
      payload: {
        extents: {
          ...extents,
          x: extents.x - event.dx / scale,
          y: extents.y - event.dy / scale,
        },
      },
    })
  }, [extents, onToolEvent, scale])

  // https://stackoverflow.com/a/30992764/517254
  // const handleZoom = useCallback(({ x, y, zoomFactor }: ZoomEvent) => {
  //   dispatch({
  //     type: 'zoom',
  //     payload: {
  //       x,
  //       y,
  //       zoomFactor,
  //     },
  //   })
  // }, [dispatch])

  useCanvasEvent('drag', handleDrag)
  // useCanvasEvent('zoom', handleZoom)

  return (
    null
  )
}
