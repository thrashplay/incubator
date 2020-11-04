import { IDLE_ACTION } from '../scene'

export const Actions = {
  BefriendingElves: {
    type: 'befriending-elves',
    data: 'Legolas Greenleaf',
  },
  Burninating: {
    type: 'burninating',
    data: {
      location: 'The Countryside',
      target: 'The Peasants',
    },
  },
  Moving: {
    type: 'move',
    data: { x: 123, y: 456 },
  },
  Grumbling: { type: 'grumbling' },
  Idle: IDLE_ACTION,
} as const
