import { Point } from '../../common'
import { ActionType, ActorStatus, EMPTY_FRAME } from '../frame'
import { EMPTY_SCENE, SceneState, SceneStateContainer } from '../state'

export const CharacterFixtures = {
  Treestump: {
    id: 'treestump',
    name: 'Treestump Block',
    size: 5,
    speed: 90,
  },
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
  AllThreeCharacters: {
    pcs: {
      gimli: CharacterFixtures.Gimli,
      treestump: CharacterFixtures.Treestump,
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
        standard: {
          id: 'standard',
          name: 'Standard',
          multiplier: 1,
        },
        run: {
          id: 'run',
          name: 'Run',
          multiplier: 2,
        },
      },
    },
  },
} as const

export const ActionFixtures = {
  BefriendingElves: {
    type: 'befriending-elves',
    data: 'Legolas Greenleaf',
  } as ActionType<'befriending-elves', string>,
  Burninating: {
    type: 'burninating',
    data: {
      location: 'The Countryside',
      target: 'The Peasants',
    },
  } as ActionType<'burninating', { location: string; target: string }>,
  Moving: {
    type: 'move',
    data: { x: 123, y: 456 },
  },
  Grumbling: { type: 'grumbling' },
  Idle: { type: 'idle' },
}

export const ActorStatusFixtures = {
  Gimli: {
    id: CharacterFixtures.Gimli.id,
    action: ActionFixtures.BefriendingElves,
    position: { x: 100, y: 100 },
  },
  Treestump: {
    id: CharacterFixtures.Treestump.id,
    action: ActionFixtures.Grumbling,
    position: { x: 200, y: 50 },
  },
  Trogdor: {
    id: CharacterFixtures.Trogdor.id,
    action: ActionFixtures.Burninating,
    position: { x: 7, y: 7 },
  },
}

const withPosition = (position: Point) => (actor: ActorStatus) => ({
  ...actor,
  position,
})

export const FrameFixtures = {
  AllIdle: {
    ...EMPTY_FRAME,
    actors: {
      gimli: {
        ...ActorStatusFixtures.Gimli,
        action: ActionFixtures.Idle,
        position: { x: 105, y: 105 },
      },
      trogdor: {
        ...ActorStatusFixtures.Trogdor,
        action: ActionFixtures.Idle,
        position: { x: 5, y: 5 },
      },
    },
  },
  Empty: {
    ...EMPTY_FRAME,
  },
  TypicalActions: {
    ...EMPTY_FRAME,
    actors: {
      gimli: ActorStatusFixtures.Gimli,
      trogdor: ActorStatusFixtures.Trogdor,
    },
  },
  WithGimliAndTreestumpInMelee: {
    ...EMPTY_FRAME,
    actors: {
      gimli: withPosition({ x: 100, y: 100 })(ActorStatusFixtures.Gimli),
      treestump: withPosition({ x: 100, y: 114 })(ActorStatusFixtures.Treestump),
      trogdor: withPosition({ x: 100, y: 113 })(ActorStatusFixtures.Trogdor),
    },
  },
  WithGimliRunning: {
    ...EMPTY_FRAME,
    actors: {
      gimli: {
        ...ActorStatusFixtures.Gimli,
        movementMode: 'run',
        action: ActionFixtures.Moving,
      },
      trogdor: ActorStatusFixtures.Trogdor,
    },
  },
}

export const SceneStateFixtures = {
  CharactersInFirstFrame: {
    ...EMPTY_SCENE,
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.Empty],
  },
  Default: {
    ...EMPTY_SCENE,
    characters: [],
    frames: [FrameFixtures.Empty],
  },
  FiveIdleFrames: {
    ...EMPTY_SCENE,
    characters: ['gimli', 'trogdor'],
    frames: [
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
      FrameFixtures.AllIdle,
    ],
  },
  IdleBeforeTypicalActions: {
    ...EMPTY_SCENE,
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.AllIdle, FrameFixtures.TypicalActions],
  },
  SingleIdleFrame: {
    ...EMPTY_SCENE,
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.AllIdle],
  },
  SingleTypicalFrame: {
    ...EMPTY_SCENE,
    characters: ['gimli', 'trogdor'],
    frames: [FrameFixtures.TypicalActions],
  },
  WithGimliAndTreestumpInMelee: {
    ...EMPTY_SCENE,
    characters: ['gimli', 'treestump', 'trogdor'],
    frames: [FrameFixtures.WithGimliAndTreestumpInMelee],
  },
  WithGimliRunning: {
    ...EMPTY_SCENE,
    characters: ['gimli'],
    frames: [FrameFixtures.WithGimliRunning],
  },
}

export const defaultDependencies = {
  characters: CharacterStateFixtures.AllThreeCharacters,
  rules: RulesStateFixtures.Minimal,
}

export const createStateWithDependencies = (
  scene: SceneState,
  dependencies: Omit<SceneStateContainer, 'scene'> = defaultDependencies
): SceneStateContainer => ({
  ...dependencies,
  scene,
})
