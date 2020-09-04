import React from 'react'

import { Tile } from '@thrashplay/hexmarch-model'

import { LookAndFeel } from '../look-and-feel'
import { BorderOnlyTileRenderer, FlatColorTileRenderer } from '../renderers'
import { TileRendererProps } from '../types'

const getTileColor = (tile: Tile) => {
  switch (tile.terrainType.key) {
    case 'grass':
      return 'green'

    case 'mountain':
      return 'gray'

    case 'water':
      return 'blue'

    default:
      return 'black'
  }
}

export const DefaultLookAndFeel: LookAndFeel = {
  getEmptyRenderer: () => function EmptyHex (props: TileRendererProps) {
    return <BorderOnlyTileRenderer
      borderColor="gray"
      borderWidth={0.25}
      {...props}
    />
  },
  getSelectionRenderer: () => function EmptyHex (props: TileRendererProps) {
    return <BorderOnlyTileRenderer
      borderColor="red"
      borderWidth={0.25}
      {...props}
    />
  },
  getTileRenderer: (tile: Tile) => function EmptyHex (props: TileRendererProps) {
    return <FlatColorTileRenderer
      borderWidth={0.25}
      fillColor={getTileColor(tile)}
      {...props}
    />
  },
}
