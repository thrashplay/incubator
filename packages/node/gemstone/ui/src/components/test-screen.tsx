import { toLower } from 'lodash'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import {
  GameState,
  MovementCommands,
  SceneCommands,
} from '@thrashplay/gemstone-engine'
import {
  addCharacter,
  Character,
  CharacterId,
  getActor,
  getActors,
  getTime,
} from '@thrashplay/gemstone-model'
import { FrameProvider, useDispatch, useValue } from '@thrashplay/gemstone-ui-core'

import { ActorList } from './actor-list'
import { InspectPanel } from './inspect-panel'
import { SceneMap } from './scene/scene-map'
import { TimeControls } from './time-controls'

const initializeTestScene = () => (_state: GameState) => {
  const createCharacter = (name: string, speed = 90, stats?: Partial<Character>): Character => ({
    id: toLower(name),
    name,
    size: 3,
    speed,
    ...stats,
  })

  const createRandomPosition = () => ({
    x: Math.random() * 500,
    y: Math.random() * 500,
  })

  return [
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
    MovementCommands.moveTo('pixie', createRandomPosition()),
    // MovementCommands.moveTo('nate', createRandomPosition()),
    // MovementCommands.moveTo('seth', createRandomPosition()),
    // MovementCommands.moveTo('tom', createRandomPosition()),
  ]
}

export const TestScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeTestScene())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedActorId, setSelectedActorId] = useState<CharacterId | undefined>(undefined)

  const actors = useValue(getActors, { fallback: true, frameTag: 'selected' })
  const selectedTime = useValue(getTime, { fallback: true, frameTag: 'selected' })
  const selectedActor = useValue(getActor, { characterId: selectedActorId, fallback: true, frameTag: 'selected' })

  const handleSelectActor = (id: CharacterId) => setSelectedActorId(id)

  return (
    <FrameProvider frameQuery={{ fallback: true, frameTag: 'selected' }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <ActorList
              actors={actors}
              onSelect={handleSelectActor}
              style={styles.actorList}
              title="Combatants"
            />
            <InspectPanel
              actorId={selectedActorId}
              style={styles.inspectPanel}
            />
          </View>
          <SceneMap
            actors={actors}
            selectedActor={selectedActor as any}
            style={styles.locationMap}
            timeOffset={selectedTime}
          />
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
  sidebar,
  timeBar,
})
