import { rgbaArray } from 'react-native-svg'

import { HexLayout } from '@thrashplay/hex-utils'

export type SvgColor = string | number | rgbaArray

export type ToolName = 'pointer'

export interface TileRendererProps {
  /** the layout of the map containing this tile */
  mapLayout: HexLayout

  /** q-coordinate of the hex being rendered */
  q: number

  /** r-coordinate of the hex being rendered */
  r: number
}

export type TileRenderer<TProps extends TileRendererProps = any> = (props: TProps) => JSX.Element
