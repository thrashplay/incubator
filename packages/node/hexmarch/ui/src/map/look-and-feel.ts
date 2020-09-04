import { Tile } from '@thrashplay/hexmarch-model'

import { TileRenderer } from './types'

export interface LookAndFeel {
  /**
   * Gets the renderer used to draw all visible tiles that have no map data.
   * If this value is undefined, then empty tiles will not be rendered.
   **/
  getEmptyRenderer?: () => TileRenderer

  /**
   * Gets the renderer used to indicate the selected tile, which is drawn on top of its base renderer.
   *
   * If the selected tile is not empty, the tile data is passed to this function. Otherwise, the `tile`
   * parameter is undefined.
   *
   * If this value is undefined, then empty tiles will not be rendered.
   **/
  getSelectionRenderer?: (tile?: Tile) => TileRenderer

  /**
   * Gets the renderer used to render tiles that have tile data. The data for the tile to render will
   * be passed to this function.
   **/
  getTileRenderer: (tile: Tile) => TileRenderer
}
