import { map } from 'lodash/fp'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import {
  Actor,
  CharacterId,
  FrameActions,
  getActiveMovementMode,
  getActor,
  getMovementModes,
  MovementMode,
  MovementModeId,
} from '@thrashplay/gemstone-model'

import { useDispatch, useValue } from '../store'

export interface InspectProps {
  /** the ID of the character to control */
  actorId?: CharacterId

  /** the frame number to render the panel for, or the current frame by default */
  frameNumber?: number

  /** style to apply to the component container */
  style?: StyleProp<ViewStyle>
}

export const Inspect = ({
  actorId,
  frameNumber,
  style,
}: InspectProps) => {
  const dispatch = useDispatch()

  const actor = useValue(getActor, { characterId: actorId, frameNumber })
  const movementModes = useValue(getMovementModes)
  const movementMode = useValue(getActiveMovementMode, { characterId: actorId, frameNumber })

  const renderControls = (actor: Actor) => {
    const handleMovementModeSelection = (id: MovementModeId) => () => {
      dispatch(FrameActions.movementModeChanged({ characterId: actorId!, mode: id }))
    }

    const createMovementModeButton = ({ id, name }: MovementMode) => {
      const disabled = id === movementMode.id
      return (
        <Button
          key={id}
          compact={true}
          disabled={disabled}
          labelStyle={disabled ? styles.smallOptionButtonSelectedText : styles.smallOptionButtonText}
          mode="text"
          onPress={handleMovementModeSelection(id)}
          style={styles.smallOptionButton}
          uppercase={false}
        >
          {name}
        </Button>
      )
    }

    return (
      <>
        <View style={styles.content}>
          <Text>Movement Mode: {movementMode?.name ?? 'unknown'} ({movementMode?.multiplier ?? 1}x)</Text>
          <View style={styles.smallOptionRow}>
            {map(createMovementModeButton)(movementModes)}
          </View>
        </View>
      </>
    )
  }

  return actor === undefined ? null : (
    <View style={style}>
      <Text style={styles.title}>{actor.name}</Text>
      {actor && renderControls(actor)}
    </View>
  )
}

const title: TextStyle = {
  backgroundColor: '#ccc',
  borderBottomColor: '#666',
  borderBottomWidth: 1,
  padding: 16,
}

const content: ViewStyle = {
  padding: 16,
}

const smallOptionButton: ViewStyle = {
  paddingLeft: 0,
  paddingRight: 0,
}

const smallOptionButtonText: TextStyle = {
  fontSize: 10,
}

const smallOptionButtonSelectedText: TextStyle = {
  ...smallOptionButtonText,
  color: 'black',
  fontWeight: 'bold',
}

const smallOptionRow: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
}

const styles = StyleSheet.create({
  content,
  smallOptionButton,
  smallOptionButtonSelectedText,
  smallOptionButtonText,
  smallOptionRow,
  title,
})
