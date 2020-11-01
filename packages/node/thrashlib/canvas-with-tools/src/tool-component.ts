import { ComponentType } from 'react'

import { ContentViewProps } from './content-view-props'
import { ToolEvent, ToolEventDispatch } from './tool-events'

export type ToolProps<TEvent extends ToolEvent, TData extends any = any> = ContentViewProps<TData> & {
  /** a function used by tools to trigger app-specific updates to the canvas data */
  toolEventDispatch: ToolEventDispatch<TEvent>
}

export type ToolComponent<
  TToolEvent extends ToolEvent = ToolEvent,
  TData extends any = any,
> = ComponentType<ToolProps<TToolEvent, TData>>
