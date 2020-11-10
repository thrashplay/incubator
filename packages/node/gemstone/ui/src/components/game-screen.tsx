import { range, toLower } from 'lodash'
import { map } from 'lodash/fp'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Appbar } from 'react-native-paper'

import { roll } from '@thrashplay/gemstone-dice'
import {
  GameState,
  MapCommands,
  MovementCommands,
  OsricDungeonCommands,
  SceneCommands,
} from '@thrashplay/gemstone-engine'
import { Area } from '@thrashplay/gemstone-map-model'
import {
  addCharacter,
  Character,
  getTableRoller,
  getTime,
  TableRollerFunction,
} from '@thrashplay/gemstone-model'
import { FrameProvider, useDispatch, useValue } from '@thrashplay/gemstone-ui-core'
import { Dimensions } from '@thrashplay/math'

import { CombatView } from './combat-view/combat-view'
import { MapEditorView } from './map-editor-view'
import { TimeControls } from './time-controls'

type Mode = 'combat' | 'gm' | 'map-editor'

// eslint-disable-next-line @typescript-eslint/naming-convention
const TEMP__loadData = (_: GameState) => [
  OsricDungeonCommands.initialize(),
]

// eslint-disable-next-line @typescript-eslint/naming-convention
const TEMP__createMap = (state: GameState) => {
  const room = (width: number, height: number, cx: number, cy: number) => ({
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
  })

  const passage = (x1: number, y1: number, w: number, h: number) => ({
    x: x1,
    y: y1,
    width: w,
    height: h,
  })

  const createRoom = () => {
    return MapCommands.createRectangularRoom(room(
      roll('1d91+9'),
      roll('1d91+9'),
      roll('1d500-250'),
      roll('1d500-250')
    ))
  }

  const createPassage = () => {
    return MapCommands.createRectangularRoom(passage(
      roll('1d500-250'),
      roll('1d500-250'),
      roll('5d10+5'),
      roll('3d6')
    ))
  }

  return [...map(createRoom)(range(1, 25)), ...map(createPassage)(range(1, 25))]
  // [
  //   MapCommands.createRectangularRoom(room(60, 60, 0, 0)),
  //   MapCommands.createRectangularRoom(room(45, 60, -30, -90)),
  //   MapCommands.createRectangularRoom(room(90, 60, 60, -75)),
  //   MapCommands.createRectangularRoom(room(80, 30, 160, -75)),
  //   MapCommands.createRectangularRoom(room(60, 60, 10, -160)),

  //   MapCommands.createRectangularRoom(passage(-20, -60, 5, 30)),
  //   MapCommands.createRectangularRoom(passage(20, -45, 5, 15)),
  //   MapCommands.createRectangularRoom(passage(-15, -130, 5, 10)),
  //   MapCommands.createRectangularRoom(passage(20, -130, 15, 25)),
  //   MapCommands.createRectangularRoom(passage(105, -77.5, 15, 5)),

  //   // MapCommands.addBreakInWall('1', 10),
  //   // MapCommands.addBreakInWall('3', 5),
  // ]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const TEMP__initializeScene = (state: GameState) => {
  const createCharacter = (name: string, speed = 90, stats?: Partial<Character>): Character => ({
    id: toLower(name),
    name,
    size: 3,
    speed,
    ...stats,
  })

  const INITIAL_ROOM_BOUNDS = { x: -30, y: -30, width: 60, height: 60 }
  const createRandomPosition = () => ({
    x: INITIAL_ROOM_BOUNDS.x + 10 + Math.random() * (INITIAL_ROOM_BOUNDS.width - 20),
    y: INITIAL_ROOM_BOUNDS.y + 10 + Math.random() * (INITIAL_ROOM_BOUNDS.height - 20),
  })

  return [
    // create the map
    // createSquareRoom(INITIAL_ROOM_BOUNDS),
    // createSquareRoom(SIDE_ROOM_BOUNDS),

    // add the PCs
    // addCharacter(createCharacter('Human', 90)),
    addCharacter(createCharacter('Ogre', 60, { reach: 10, size: 6 })),
    // addCharacter(createCharacter('Pixie', 120, { reach: 5, size: 1 })),
    // addCharacter(createCharacter('Dan')),
    addCharacter(createCharacter('Nate')),
    // addCharacter(createCharacter('Seth')),
    // addCharacter(createCharacter('Tom')),

    // start the scene
    SceneCommands.startNewScene(),

    // move PCs to random starting positions
    // MovementCommands.moveTo('human', createRandomPosition()),
    MovementCommands.moveTo('ogre', createRandomPosition()),
    // MovementCommands.moveTo('pixie', createRandomPosition()),
    // MovementCommands.moveTo('dan', createRandomPosition()),
    MovementCommands.moveTo('nate', createRandomPosition()),
    // MovementCommands.moveTo('seth', createRandomPosition()),
    // MovementCommands.moveTo('tom', createRandomPosition()),

    // create random tables
  ]
}

const initializeApp = (_: GameState) => [
  TEMP__loadData,
  TEMP__createMap,
  TEMP__initializeScene,
]

export const GameScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeApp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedMode, setSelectedMode] = useState<Mode>('map-editor')
  const [selectedAreaId, setSelectedAreaId] = useState<Area['id'] | undefined>(undefined)

  const getModeTitle = () => {
    switch (selectedMode) {
      case 'combat':
        return 'Combat'

      case 'gm':
        return 'GM Tools'

      case 'map-editor':
        return 'Map Editor'

      default:
        return 'Gemstone'
    }
  }
  const getButtonStylesForMode = (mode: Mode) => selectedMode === mode
    ? [styles.modeSelectButton, styles.selected]
    : styles.modeSelectButton

  const handleModeSelect = (mode: Mode) => () => setSelectedMode(mode)

  const createModeButton = (mode: Mode, icon: string) => (
    <Appbar.Action
      color={selectedMode === mode ? '#333' : '#fff'}
      icon={icon}
      onPress={handleModeSelect(mode)}
      style={getButtonStylesForMode(mode)}
    />
  )

  return (
    <FrameProvider frameQuery={{ fallback: true, frameTag: 'selected' }}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title={getModeTitle()} />
          {createModeButton('combat', 'sword-cross')}
          {createModeButton('map-editor', 'map-legend')}
          {createModeButton('gm', 'pencil')}
        </Appbar.Header>
        {selectedMode === 'combat' && <CombatView style={styles.content}/>}
        {selectedMode === 'map-editor' && <MapEditorView style={styles.content}/>}
        <TimeControls style={styles.timeControls}/>
      </View>
    </FrameProvider>
  )
}

const inspectPanel: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexBasis: 0,
  // flexGrow: 1,
  marginTop: 8,
}

const container: ViewStyle = {
  flexDirection: 'column',
  flexGrow: 1,
}

const content: ViewStyle = {
  flexGrow: 1,
  marginBottom: 8,
  marginLeft: 8,
  marginRight: 8,
  marginTop: 8,
}

const modeSelectButton: ViewStyle = {
}

const selected: ViewStyle = {
  backgroundColor: '#ffffff99',
}

const timeControls: ViewStyle = {
}

const styles = StyleSheet.create({
  container,
  content,
  inspectPanel,
  modeSelectButton,
  selected,
  timeControls,
})
