import { IntentionType } from '../../model/frame'
import { SceneState, SceneStateContainer } from '../../model/scene'

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

export const RulesStateFixtures = {
  Minimal: {
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
    segmentDuration: 5,
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

export const SceneStateFixtures = {
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
  SingleIdleFrame: {
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.AllIdle],
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
