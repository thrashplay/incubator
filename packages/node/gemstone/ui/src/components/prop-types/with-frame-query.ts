export interface FrameQueryProp {
  /** whether the current frame's data should be used if the tag does not exist */
  fallback?: boolean

  /** the frame trag to render the panel for */
  frameTag?: string
}

export interface WithFrameQuery {
  /** query options for finding the frame of interest for the current rendering, defaults to the current frame */
  frameQuery?: FrameQueryProp
}
