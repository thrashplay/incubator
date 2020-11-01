import React from 'react'

import { ToolProps } from '../tool-component'

import { PanAndZoomEvent, PanAndZoomTool } from './pan-and-zoom'

export const ZoomComponent = (props: ToolProps<PanAndZoomEvent>) => {
  return <PanAndZoomTool disablePan={true} {...props} />
}
