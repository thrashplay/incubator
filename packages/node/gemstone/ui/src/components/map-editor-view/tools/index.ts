import { ToolOption } from '../../map-view/tool-option'

import { SelectTool } from './select'

export const ToolOptions: readonly ToolOption[] = [
  {
    component: SelectTool,
    icon: 'cursor-default-outline',
    id: 'select',
    panAndZoomMode: 'pan-and-zoom',
  },
]
