import { toLower } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import {
  addCharacter, 
  Character, 
  CharacterId, 
  declareMoveIntention,
  GameState, 
  getActor,
  getActors, 
  move,
  startNewScene,
} from '@thrashplay/gemstone-engine'

import { useStateQuery } from '../game-context'
import { useGame } from '../game-context/use-game'

import { CharacterList } from './character-list'
import { SceneMap } from './scene/scene-map'
import { Button } from 'react-native-paper'
import Slider from '@react-native-community/slider'

const initializeTestScene = () => (_state: GameState) => {
  const createCharacter = (name: string, speed = 90): Character => ({
    id: toLower(name),
    name,
    speed,
  })

  const createRandomPosition = () => ({
    x: Math.random() * 500,
    y: Math.random() * 500,
  })

  return [
    // add the PCs
    addCharacter(createCharacter('Dan')),
    addCharacter(createCharacter('Nate')),
    addCharacter(createCharacter('Seth')),
    addCharacter(createCharacter('Tom')),

    // start the scene
    startNewScene(),

    // move PCs to random starting positions
    move('dan', createRandomPosition()),
    move('nate', createRandomPosition()),
    move('seth', createRandomPosition()),
    move('tom', createRandomPosition()),
  ]
}

export const TestScreen = () => {
  const { dispatch, execute } = useGame()

  useEffect(() => {
    execute(initializeTestScene())
  }, [])

  const [selectedActorId, setSelectedActorId] = useState<CharacterId | undefined>(undefined)

  const actors = useStateQuery(getActors)
  const selectedActor = useStateQuery(getActor, { characterId: selectedActorId })

  const handleSelectActor = (id: CharacterId) => setSelectedActorId(id)

  const handleSetMoveIntention = useCallback((x: number, y: number) => {
    if (selectedActorId !== undefined) {
      execute(declareMoveIntention(selectedActorId, x, y))
    }
  }, [dispatch, selectedActorId])

  const handleAdvanceClock = useCallback(() => {
    dispatch(timeAdvanced(3))
  }, [dispatch])

  const handleSliderChange = useCallback((value: number) => {
    dispatch(timeChanged(value / 5))
  }, [dispatch])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CharacterList
          characters={actors}
          onSelect={handleSelectActor}
          style={styles.actorList}
          title="Combatants"
        />
        <SceneMap
          actors={actors}
          onSetMoveIntention={handleSetMoveIntention}
          selectedActor={selectedActor as any}
          style={styles.locationMap}
        />
      </View>
      {/* <View style={styles.timeBar}>
        <Button
          mode="contained"
          onPress={handleAdvanceClock}
          style={{ width: 180 }}
        >
          Advance Clock
        </Button>
        <View style={styles.timeTextContainer}>
          <Text>{currentSegment * 5}s</Text>
        </View>
        <Slider
          maximumValue={1000}
          minimumValue={0}
          onValueChange={handleSliderChange}
          step={5}
          style={{ marginLeft: 16 }}
          value={currentSegment * 5}
        />
      </View> */}
    </View>
  )
}

const actorList: ViewStyle = {
  flexGrow: 0.1,
  marginRight: 8,
  maxWidth: 300,
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

const timeBar: ViewStyle = {
  alignItems: 'center',
  backgroundColor: '#eee',
  flexDirection: 'row',
  marginTop: 8,
  padding: 8,
}

const timeTextContainer: ViewStyle = {
  marginLeft: 16,
}

const styles = StyleSheet.create({
  actorList,
  container,
  content,
  locationMap,
  timeBar,
  timeTextContainer,
})
