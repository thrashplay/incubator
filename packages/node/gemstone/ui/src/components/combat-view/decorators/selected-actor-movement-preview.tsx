import { createMovementPreview } from '../../actor-decorators'

export const SelectedActorMovementPreview = createMovementPreview({
  lineStyle: {
    stroke: '#666',
    strokeWidth: 1,
  },
  showLine: true,
  showTargetBody: true,
  showTargetReach: true,
  targetBodyStyle: {
    fill: '#ccc',
    stroke: '#ccc',
    strokeDasharray: [1, 1],
  },
  targetReachStyle: {
    fillOpacity: 0,
    stroke: 'gray',
    strokeDasharray: [1, 1],
    strokeWidth: 0.5,
  },
})
