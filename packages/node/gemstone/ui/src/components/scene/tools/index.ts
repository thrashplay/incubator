import { PanAndZoomTool } from '@thrashplay/canvas-with-tools'

import { AttackTool } from './attack'
import { MapEditorTool } from './map-editor'
import { MoveTool } from './move'

export const TOOL_OPTIONS = [
  {
    component: MoveTool,
    icon: 'head-snowflake-outline',
    id: 'smart-gestures',
  },
  {
    component: PanAndZoomTool,
    icon: 'hand',
    id: 'pan-and-zoom',
  },
  {
    component: MoveTool,
    icon: 'shoe-print',
    id: 'move',
  },
  {
    component: AttackTool,
    icon: 'sword-cross',
    id: 'attack',
  },
  {
    component: MapEditorTool,
    icon: 'map-legend',
    id: 'map-editor',
  },
] as const
