import { Dimensions, Extents } from '@thrashplay/math'

export type ContentViewProps<TData extends any> = Partial<Record<string, unknown>> & TData extends undefined
  ? {
    /** child elements, which will be rendered in an SVG on top of the map */
    // children?: React.ReactNode

    /** current canvas extents, in world coordinates */
    extents: Extents

    /** the size of the canvas viewport, in screen coordinates */
    viewport: Dimensions

    /** additional, canvas-specific data that is passed to tools and canvas components */
    data: TData
  }
  : {
    /** child elements, which will be rendered in an SVG on top of the map */
    // children?: React.ReactNode

    /** additional, canvas-specific data that is passed to tools and canvas components */
    data: TData

    /** current canvas extents, in world coordinates */
    extents: Extents

    /** the size of the canvas viewport, in screen coordinates */
    viewport: Dimensions
  }
