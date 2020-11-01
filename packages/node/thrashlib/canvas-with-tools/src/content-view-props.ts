import { Dimensions, Extents } from '@thrashplay/geometry'

export type ContentViewProps<TData extends any> = Partial<Record<string, unknown>> & TData extends undefined
  ? {
    /** current canvas extents, in world coordinates */
    extents: Extents

    /** the size of the canvas viewport, in screen coordinates */
    viewport: Dimensions
  }
  : {
    /** additional, canvas-specific data that is passed to tools and canvas components */
    data: TData

    /** current canvas extents, in world coordinates */
    extents: Extents

    /** the size of the canvas viewport, in screen coordinates */
    viewport: Dimensions
  }
