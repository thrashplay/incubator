import React from 'react'

import { MapView } from '../map-view/map-view'

export const MapEditorMap = () => {
  return (
    <MapView
      toolOptions={TOOL_OPTIONS as any}
    />
  )
}
