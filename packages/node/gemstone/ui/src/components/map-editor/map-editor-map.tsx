import React from 'react'

import { MapView } from '../map-view/map-view'
import { TOOL_OPTIONS } from '../map-view/tools'

export const MapEditorMap = () => {
  return (
    <MapView
      timeOffset={0}
      toolOptions={TOOL_OPTIONS as any}
    />
  )
}
