import { EMPTY_FRAME, IntentionType } from '../frame'
import { SceneState, SceneStateContainer } from '../state'

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

export const CharacterStateFixtures = {
  Default: {
    pcs: {},
  },
  GimliOnly: {
    pcs: {
      gimli: CharacterFixtures.Gimli,
    },
  },
  GimliAndTrogdor: {
    pcs: {
      gimli: CharacterFixtures.Gimli,
      trogdor: CharacterFixtures.Trogdor,
    },
  },
}

const baseRules = {
  meleeRange: 10,
  segmentDuration: 5,
}

export const RulesStateFixtures = {
  Minimal: {
    ...baseRules,
    movement: {
      defaultMode: 'standard',
      modes: {
        hustle: {
          id: 'standard',
          name: 'Standard',
          multiplier: 1,
        },
      },
    },
  },
}

export const IntentionFixtures = {
  BefriendingElves: {
    type: 'befriending-elves',
    data: 'Legolas Greenleaf',
  } as IntentionType<'befriending-elves', string>,
  Burninating: {
    type: 'burninating',
    data: {
      location: 'The Countryside',
      target: 'The Peasants',
    },
  } as IntentionType<'burninating', { location: string; target: string }>,
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
    ...EMPTY_FRAME,
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
    ...EMPTY_FRAME,
  },
  TypicalIntentions: {
    ...EMPTY_FRAME,
    actors: {
      gimli: ActorStatusFixtures.Gimli,
      trogdor: ActorStatusFixtures.Trogdor,
    },
  },
}

export const SceneStateFixtures = {
  CharactersInFirstFrame: {
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.Empty],
  },
  Default: {
    characters: [],
    frames: [FrameFixtures.Empty],
  },
  FiveIdleFrames: {
    characters: ['gimli', 'trogdor'],
    frames: [
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
    ],
  },
  IdleBeforeTypicalIntentions: {
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.AllIdle, FrameFixtures.TypicalIntentions],
  },
  SingleIdleFrame: {
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.AllIdle],
  },
  SingleTypicalFrame: {
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.TypicalIntentions],
  },
}

export const defaultDependencies = {
  characters: CharacterStateFixtures.GimliAndTrogdor,
  rules: RulesStateFixtures.Minimal,
}

export const createStateWithDependencies = (
  scene: SceneState,
  dependencies: Omit<SceneStateContainer, 'scene'> = defaultDependencies
): SceneStateContainer => ({
  ...dependencies,
  scene,
})
