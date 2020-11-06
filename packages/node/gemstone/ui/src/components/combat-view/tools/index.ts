
import { ToolOption } from '../../map-view/tool-option'

import { AttackTool } from './attack'
import { MoveTool } from './move'

export const TOOL_OPTIONS: readonly ToolOption[] = [
  // {
  //   component: MoveTool,
  //   icon: 'head-snowflake-outline',
  //   id: 'smart-gestures',
  // },
  {
    component: MoveTool,
    icon: 'shoe-print',
    id: 'move',
    panAndZoomMode: 'zoom',
  },
  {
    component: AttackTool,
    icon: 'sword-cross',
    id: 'attack',
  },
] as const
