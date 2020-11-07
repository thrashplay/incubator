import { toLower } from 'lodash'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Appbar } from 'react-native-paper'

import {
  GameState,
  MovementCommands,
  SceneCommands,
} from '@thrashplay/gemstone-engine'
import { Area, createSquareRoom } from '@thrashplay/gemstone-map-model'
import {
  addCharacter,
  Character,
  getTime,
} from '@thrashplay/gemstone-model'
import { FrameProvider, useDispatch, useValue } from '@thrashplay/gemstone-ui-core'

import { CombatView } from './combat-view/combat-view'
import { MapEditorView } from './map-editor-view'
import { TimeControls } from './time-controls'

type Mode = 'combat' | 'gm' | 'map-editor'

const initializeTestScene = () => (_state: GameState) => {
  const createCharacter = (name: string, speed = 90, stats?: Partial<Character>): Character => ({
    id: toLower(name),
    name,
    size: 3,
    speed,
    ...stats,
  })

  const INITIAL_ROOM_BOUNDS = {
    x: 100,
    y: 100,
    width: 300,
    height: 300,
  }

  const SIDE_ROOM_BOUNDS = {
    x: 425,
    y: 150,
    width: 100,
    height: 200,
  }

  const createRandomPosition = () => ({
    x: INITIAL_ROOM_BOUNDS.x + 10 + Math.random() * (INITIAL_ROOM_BOUNDS.width - 20),
    y: INITIAL_ROOM_BOUNDS.y + 10 + Math.random() * (INITIAL_ROOM_BOUNDS.height - 20),
  })

  return [
    // create the map
    createSquareRoom(INITIAL_ROOM_BOUNDS),
    createSquareRoom(SIDE_ROOM_BOUNDS),

    // add the PCs
    addCharacter(createCharacter('Human', 90)),
    addCharacter(createCharacter('Ogre', 60, { reach: 25, size: 10 })),
    // addCharacter(createCharacter('Pixie', 120, { reach: 5, size: 1 })),
    // addCharacter(createCharacter('Dan')),
    // addCharacter(createCharacter('Nate')),
    // addCharacter(createCharacter('Seth')),
    // addCharacter(createCharacter('Tom')),

    // start the scene
    SceneCommands.startNewScene(),

    // move PCs to random starting positions
    MovementCommands.moveTo('human', createRandomPosition()),
    MovementCommands.moveTo('ogre', createRandomPosition()),
    // MovementCommands.moveTo('pixie', createRandomPosition()),
    // MovementCommands.moveTo('nate', createRandomPosition()),
    // MovementCommands.moveTo('seth', createRandomPosition()),
    // MovementCommands.moveTo('tom', createRandomPosition()),
  ]
}

export const GameScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeTestScene())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedMode, setSelectedMode] = useState<Mode>('combat')
  const [selectedAreaId, setSelectedAreaId] = useState<Area['id'] | undefined>(undefined)

  const selectedTime = useValue(getTime, { fallback: true, frameTag: 'selected' })

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
