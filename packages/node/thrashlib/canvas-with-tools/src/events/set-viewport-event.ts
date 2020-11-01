import { Dimensions } from '@thrashplay/geometry'

import { ToolEvent } from '../tool-events'

export type SetViewportEvent = ToolEvent<'viewport/set', Dimensions>
