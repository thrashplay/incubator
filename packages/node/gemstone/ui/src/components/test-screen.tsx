import Slider from '@react-native-community/slider'
import { toLower } from 'lodash'
import { filter, flow, get, head, map, matches, reject, sortBy } from 'lodash/fp'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import {
  beginMoving,
  calculateDistance,
  calculateNextFrame,
  createIntention,
  GameState,
  moveTo,
  startNewScene,
} from '@thrashplay/gemstone-engine'
import {
  Actor,
  addCharacter,
  Character,
  CharacterId,
  getActor,
  getActors,
  getCurrentFrameNumber,
  getCurrentTime,
  getSegmentDuration,
  SceneActions,
  SimulationActions,
} from '@thrashplay/gemstone-model'

import { useDispatch, useValue } from '../store'

import { ActorList } from './actor-list'
import { SceneMap } from './scene/scene-map'

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
    addCharacter(createCharacter('Dan', 60)),
    // addCharacter(createCharacter('Nate', 120)),
    // addCharacter(createCharacter('Seth')),
    // addCharacter(createCharacter('Tom')),

    // start the scene
    startNewScene(),

    // move PCs to random starting positions
    moveTo('dan', createRandomPosition()),
    moveTo('nate', createRandomPosition()),
    moveTo('seth', createRandomPosition()),
    moveTo('tom', createRandomPosition()),
  ]
}

export const TestScreen = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeTestScene())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedActorId, setSelectedActorId] = useState<CharacterId | undefined>(undefined)

  const actors = useValue(getActors)
  const currentTime = useValue(getCurrentTime)
  const frameNumber = useValue(getCurrentFrameNumber)
  const segmentDuration = useValue(getSegmentDuration)
  const selectedActor = useValue(getActor, { characterId: selectedActorId })

  const handleSelectActor = (id: CharacterId) => setSelectedActorId(id)

  const handleSetMoveIntention = useCallback((x: number, y: number) => {
    const getTarget = (): CharacterId => {
      const computeDistance = (actor: Actor) => ({
        id: actor.id,
        distance: calculateDistance(actor.status.position, { x, y }),
      })

      const closeEnoughToTarget = ({ distance }: { distance: number }) => distance < 10

      return flow(
        reject(matches({ id: selectedActorId })),
        map(computeDistance),
        filter(closeEnoughToTarget),
        sortBy(get('distance')),
        head,
        get('id')
      )(actors)
    }

    if (selectedActorId !== undefined) {
      const target = getTarget()
      return target === undefined
        ? dispatch(beginMoving(selectedActorId, x, y))
        // : dispatch(SimulationActions.intentionDeclared({
        //   characterId: selectedActorId,
        //   intention: createIntention('follow', target),
        // }))
        : dispatch(SimulationActions.intentionDeclared({
          characterId: selectedActorId,
          intention: createIntention('melee', { target }),
        }))
    }
  }, [actors, dispatch, selectedActorId])

  const handleAdvanceClock = useCallback(() => {
    dispatch(calculateNextFrame())
  }, [dispatch])

  const handleRewindClock = useCallback(() => {
    dispatch(SceneActions.frameReverted(frameNumber - 1))
  }, [dispatch, frameNumber])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActorList
          actors={actors}
          onSelect={handleSelectActor}
          style={styles.actorList}
          title="Combatants"
        />
        <SceneMap
          actors={actors}
          onSetMoveIntention={handleSetMoveIntention}
          selectedActor={selectedActor as any}
          style={styles.locationMap}
          timeOffset={currentTime}
        />
      </View>
      <View style={styles.timeBar}>
        <Button
          mode="contained"
          onPress={handleRewindClock}
          style={{ width: 32 }}
        >
          &lt;
        </Button>
        <View style={styles.timeTextContainer}>
          <Text>{currentTime}s</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleAdvanceClock}
          style={{ width: 32 }}
        >
          &gt;
        </Button>

        <Slider
          disabled={true}
          maximumValue={currentTime + 60}
          minimumValue={0}
          step={segmentDuration}
          style={{ marginLeft: 16 }}
          value={currentTime}
        />
      </View>
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
  marginRight: 16,
}

const styles = StyleSheet.create({
  actorList,
  container,
  content,
  locationMap,
  timeBar,
  timeTextContainer,
})