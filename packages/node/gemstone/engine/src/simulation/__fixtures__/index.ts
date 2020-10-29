import { IntentionState } from '../state'

export const CharacterFixtures = {
  Trogdor: {
    id: 'trogdor',
    name: 'Trogdor, the Burninator',
    speed: 120,
  },
  Gimli: {
    id: 'gimli',
    name: 'Gimli, son of Glóin',
    speed: 60,
  },
}

export const IntentionFixtures = {
  BefriendingElves: {
    type: 'befriending-elves',
    data: 'Legolas Greenleaf',
  } as IntentionState<'befriending-elves', string>,
  Burninating: {
    type: 'burninating',
    data: {
      location: 'The Countryside',
      target: 'The Peasants',
    },
  } as IntentionState<'burninating', { location: string; target: string }>,
  Grumbling: { type: 'grumbling' },
  Idle: { type: 'idle' },
}

export const ActorStatusFixtures = {
  Gimli: {
    id: CharacterFixtures.Gimli.id,
    intention: IntentionFixtures.BefriendingElves,
    position: { x: 100, y: 100 },
  },
  Trogdor: {
    id: CharacterFixtures.Trogdor.id,
    intention: IntentionFixtures.Burninating,
    position: { x: 7, y: 7 },
  },
}

export const FrameFixtures = {
  AllIdle: {
    actors: {
      gimli: {
        ...ActorStatusFixtures.Gimli,
        intention: IntentionFixtures.Idle,
        position: { x: 105, y: 105 },
      },
      trogdor: {
        ...ActorStatusFixtures.Trogdor,
        intention: IntentionFixtures.Idle,
        position: { x: 5, y: 5 },
      },
    },
  },
  Empty: {
    actors: { },
  },
  TypicalIntentions: {
    actors: {
      gimli: ActorStatusFixtures.Gimli,
      trogdor: ActorStatusFixtures.Trogdor,
    },
  },
}
