import { createMovementPreview } from '../../actor-decorators'

export const NonSelectedActorMovementPreview = createMovementPreview({
  lineStyle: {
    stroke: '#666',
    strokeWidth: 1,
  },
})
