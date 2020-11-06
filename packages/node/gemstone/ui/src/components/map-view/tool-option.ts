import { ReactElement } from 'react'

import { PanAndZoomMode } from '@thrashplay/canvas-with-tools'

import { ToolProps, ViewEvent } from '../dispatch-view-event'

export interface ToolOption<TState extends unknown = any, TViewEvent extends ViewEvent = any> {
  component: (props: ToolProps<TState, TViewEvent>) => ReactElement | null
  icon: string
  id: string

  /** the pan/zoom mode to enable while using this tool, defaults to 'none' */
  panAndZoomMode?: PanAndZoomMode
}
