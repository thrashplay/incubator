import { concat, flow } from 'lodash'
import { get, identity, join, map } from 'lodash/fp'
import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import { GameState } from '@thrashplay/gemstone-engine'
import {
  Actor,
  CharacterId,
  FrameEvents,
  getActiveMovementMode,
  getActor,
  getCurrentSpeed,
  getMovementModes,
  getPlayerCharacterName,
  getReach,
  getReachableTargets,
  getTarget,
  MovementMode,
  MovementModeId,
  SelectorParameters,
} from '@thrashplay/gemstone-model'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { useFrameQuery } from '../frame-context'
import { useDispatch, useValue } from '../store'

export interface InspectPanelProps extends WithViewStyles<'style'> {
  /** the ID of the character to control */
  actorId?: CharacterId
}

interface AttributeRowProps<TAttribute> extends WithViewStyles<'style'> {
  actorId: CharacterId

  /** function used to convert the selected value into a string for display */
  format?: (value: TAttribute) => string
  name: string
  selector: (state: GameState, params: SelectorParameters) => TAttribute
}

const AttributeRow = <TAttribute extends unknown = any>({
  actorId,
  format = identity,
  name,
  selector,
  style,
}: AttributeRowProps<TAttribute>) => {
  const frameQuery = useFrameQuery()
  const value = useValue(selector, { characterId: actorId, ...frameQuery })

  return (
    <View style={[styles.attributeRow, style]}>
      <Text style={styles.attributeLabel}>{name}:</Text>
      <Text style={styles.attributeValue}>{format(value)}</Text>
    </View>
  )
}

const appendDistanceUnit = (value: any) => value === undefined ? 'None' : `${value} ft`
const getActorNames = (value: Actor[]) => flow(
  map(get('name')),
  join(', ')
)(value)

export const InspectPanel = ({
  actorId,
  style,
}: InspectPanelProps) => {
  const dispatch = useDispatch()

  const frameQuery = useFrameQuery()
  const actor = useValue(getActor, { ...frameQuery, characterId: actorId })
  const movementModes = useValue(getMovementModes)
  const movementMode = useValue(getActiveMovementMode, { ...frameQuery, characterId: actorId })

  const renderControls = (actor: Actor) => {
    const handleMovementModeSelection = (id: MovementModeId) => () => {
      dispatch(FrameEvents.movementModeChanged({ characterId: actorId!, mode: id }))
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
        actorId={actorId}
        name={name}
        selector={selector}
        {...rest}
      />
    )

    return (
      <>
        <View style={styles.content}>
          {createAttributeRow('Name', getPlayerCharacterName, { style: styles.firstRow })}
          {createAttributeRow('Target', getTarget)}
          {createAttributeRow('Speed', getCurrentSpeed, { format: appendDistanceUnit })}
          {createAttributeRow('Reach', getReach, { format: appendDistanceUnit })}
          {createAttributeRow('In Range', getReachableTargets, { format: getActorNames })}
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

const attributeLabel: TextStyle = {
  fontWeight: 'bold',
  marginRight: 8,
}

const attributeRow: ViewStyle = {
  flexDirection: 'row',
  marginBottom: 8,
  marginTop: 8,
}

const attributeValue: TextStyle = {

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
  attributeLabel,
  attributeRow,
  attributeValue,
  content,
  firstRow,
  smallOptionButton,
  smallOptionButtonSelectedText,
  smallOptionButtonText,
  smallOptionRow,
  title,
})
