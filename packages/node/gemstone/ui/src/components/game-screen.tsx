import { toLower } from 'lodash'
import { noop } from 'lodash/fp'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Button, ToggleButton } from 'react-native-paper'

import {
  GameState,
  MovementCommands,
  SceneCommands,
} from '@thrashplay/gemstone-engine'
import { Area, createSquareRoom } from '@thrashplay/gemstone-map-model'
import {
  addCharacter,
  Character,
  CharacterId,
  getActor,
  getActors,
  getTime,
} from '@thrashplay/gemstone-model'
import { FrameProvider, useDispatch, useValue } from '@thrashplay/gemstone-ui-core'

import { ActorInspectPanel } from './actor-inspect-panel'
import { ActorList } from './actor-list'
import { CombatMap } from './combat-map/combat-map'
import { MapAreaInspectPanel } from './map-editor/map-editor-inspect-panel'
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

  const createRandomPosition = () => ({
    x: INITIAL_ROOM_BOUNDS.x + 10 + Math.random() * (INITIAL_ROOM_BOUNDS.width - 20),
    y: INITIAL_ROOM_BOUNDS.y + 10 + Math.random() * (INITIAL_ROOM_BOUNDS.height - 20),
  })

  return [
    // create the map
    createSquareRoom(INITIAL_ROOM_BOUNDS),

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

  const [selectedMode, setSelectedMode] = useState<Mode>('map-editor')
  const [selectedActorId, setSelectedActorId] = useState<CharacterId | undefined>(undefined)
  const [selectedAreaId, setSelectedAreaId] = useState<Area['id'] | undefined>(undefined)

  const actors = useValue(getActors, { fallback: true, frameTag: 'selected' })
  const selectedTime = useValue(getTime, { fallback: true, frameTag: 'selected' })
  const selectedActor = useValue(getActor, { characterId: selectedActorId, fallback: true, frameTag: 'selected' })

  const handleSelectActor = (id: CharacterId) => setSelectedActorId(id)
  const handleSelectArea = (id: Area['id']) => setSelectedAreaId(id)

  const getToggleStatusForMode = (mode: Mode) => selectedMode === mode ? 'checked' : 'unchecked'
  const handleModeSelect = (mode: Mode) => () => setSelectedMode(mode)

  const renderCombatControls = () => {
    return (
      <>
        <ActorList
          actors={actors}
          onSelect={handleSelectActor}
          style={styles.actorList}
          title="Combatants"
        />
        {selectedActorId && (
          <ActorInspectPanel
            actorId={selectedActorId}
            style={styles.inspectPanel}
          />
        )}
      </>
    )
  }

  const renderMapEditorControls = () => {
    return (
      <>
        {selectedAreaId && (
          <MapAreaInspectPanel
            areaId={selectedAreaId}
            style={styles.inspectPanel}
          />
        )}
      </>
    )
  }

  return (
    <FrameProvider frameQuery={{ fallback: true, frameTag: 'selected' }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <View style={styles.modeSelectBar}>
              <ToggleButton
                icon="map-legend"
                onPress={handleModeSelect('map-editor')}
                status={getToggleStatusForMode('map-editor')}
                style={styles.modeSelectButton}
              />
              <ToggleButton
                icon="sword-cross"
                onPress={handleModeSelect('combat')}
                status={getToggleStatusForMode('combat')}
                style={styles.modeSelectButton}
              />
              <ToggleButton
                icon="pencil"
                onPress={handleModeSelect('gm')}
                status={getToggleStatusForMode('gm')}
                style={styles.modeSelectButton}
              />
            </View>
            {selectedMode === 'combat' && renderCombatControls()}
            {selectedMode === 'map-editor' && renderMapEditorControls()}

          </View>
          {/* <SceneMap
            actors={actors}
            selectedActor={selectedActor as any}
            style={styles.locationMap}
            timeOffset={selectedTime}
          /> */}
          <CombatMap />
        </View>
        <TimeControls
          style={styles.timeBar}
        />
      </View>
    </FrameProvider>
  )
}

const actorList: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexBasis: 0,
  flexGrow: 1,
}

const inspectPanel: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexBasis: 0,
  flexGrow: 1,
  marginTop: 8,
}

const container: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  marginBottom: 8,
  marginLeft: 8,
  marginRight: 8,
  marginTop: 8,
}

const content: ViewStyle = {
  flexDirection: 'row',
  flexGrow: 1,
}

const locationMap: ViewStyle = {
  flexGrow: 1,
}

const modeSelectBar: ViewStyle = {
  flexDirection: 'row',
  marginBottom: 4,
}

const modeSelectButton: ViewStyle = {
  flex: 1,
}

const sidebar: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginRight: 16,
  width: 300,
}

const timeBar: ViewStyle = {
  marginTop: 8,
}

const styles = StyleSheet.create({
  actorList,
  container,
  content,
  inspectPanel,
  locationMap,
  modeSelectBar,
  modeSelectButton,
  sidebar,
  timeBar,
})
