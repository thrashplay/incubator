import { map } from 'lodash/fp'
import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import {
  Actor,
  CharacterId,
  FrameEvents,
  getActiveMovementMode,
  getActor,
  getCurrentSpeed,
  getMovementModes,
  getPosition,
  getReach,
  getReachableTargets,
  getTarget,
  MovementMode,
  MovementModeId,
} from '@thrashplay/gemstone-model'
import { Format, useDispatch, useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { AttributeRow, AttributeRowProps } from '../attribute-row'

export interface ActorInspectPanelProps extends WithViewStyles<'style'> {
  /** the ID of the character to control */
  actorId: CharacterId
}

export const ActorInspectPanel = ({
  actorId,
  style,
}: ActorInspectPanelProps) => {
  const dispatch = useDispatch()

  const frameQuery = useFrameQuery()
  const actor = useValue(getActor, { ...frameQuery, characterId: actorId })
  const movementModes = useValue(getMovementModes)
  const movementMode = useValue(getActiveMovementMode, { ...frameQuery, characterId: actorId })

  const renderControls = (_: Actor) => {
    const handleMovementModeSelection = (id: MovementModeId) => () => {
      dispatch(FrameEvents.movementModeChanged({ characterId: actorId, mode: id }))
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

    const createAttributeRow = <TAttribute extends unknown = any>(
      name: string,
      selector: AttributeRowProps<TAttribute>['selector'],
      rest?: Partial<AttributeRowProps<TAttribute>>
    ) => actorId === undefined ? null : (
      <AttributeRow
        key={name}
        name={name}
        selector={selector}
        selectorParams={{ characterId: actorId, ...frameQuery }}
        {...rest}
      />
    )

    return (
      <>
        <View style={styles.content}>
          {createAttributeRow('Position', getPosition, { format: Format.point })}
          {createAttributeRow('Target', getTarget)}
          {createAttributeRow('Speed', getCurrentSpeed, { format: Format.distance })}
          {createAttributeRow('Reach', getReach, { format: Format.distance })}
          {createAttributeRow('In Range', getReachableTargets, { format: Format.actorList })}
          {createAttributeRow('Movement Mode', getActiveMovementMode, { format: Format.movementMode })}
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

const content: ViewStyle = {
  padding: 16,
}

const firstRow: ViewStyle = {
  marginTop: 0,
}

const title: TextStyle = {
  backgroundColor: '#ccc',
  borderBottomColor: '#666',
  borderBottomWidth: 1,
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
  firstRow,
  smallOptionButton,
  smallOptionButtonSelectedText,
  smallOptionButtonText,
  smallOptionRow,
  title,
})
