import React from 'react'

import { ToolProps } from '../tool-component'

import { PanAndZoomEvent, PanAndZoomTool } from './pan-and-zoom'

export const PanTool = (props: ToolProps<PanAndZoomEvent>) => {
  return <PanAndZoomTool disableZoom={true} {...props} />
}
