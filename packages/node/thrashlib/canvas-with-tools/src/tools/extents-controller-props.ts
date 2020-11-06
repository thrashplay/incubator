import { Extents } from '@thrashplay/math'

/** Prop type for tools that update extents. */
export interface ExtentsControllerProps {
  onExtentsChanged: (extents: Extents) => void
}
