import { map, noop } from 'lodash/fp'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { List } from 'react-native-paper'

import { getPublicActionDescription } from '@thrashplay/gemstone-engine'
import { Actor, CharacterId, getActors } from '@thrashplay/gemstone-model'

import { useSelector, useValue } from '../store'
const NO_STYLES = {}

export interface ActorListProps {
  /** list of actors to include in the list */
  actors?: Actor[]

  /** the frame number to render the list for, or the current frame by default */
  frameNumber?: number

  /** the actor to initially select (onSelect is not called for this initial selection) */
  initialSelection?: Actor

  /** callback notified when an actor is selected */
  onSelect?: (id: CharacterId) => void

  /** style to apply to the list's container */
  style?: StyleProp<ViewStyle>

  /** optional title string to display above the list */
  title?: string

  /** style to use for the title */
  titleStyle?: StyleProp<TextStyle>
}

export const ActorList = ({
  frameNumber,
  initialSelection,
  onSelect = noop,
  style,
  title,
  titleStyle,
}: ActorListProps) => {
  const getActionDescription = useSelector(getPublicActionDescription)
  const [selectedActorId, setSelectedActorId] = useState<string | undefined>(initialSelection?.id)

  const actors = useValue(getActors, { frameNumber })

  const handleListPress = (actor: Actor) => () => {
    onSelect(actor.id)
    setSelectedActorId(actor.id)
  }

  const isSelected = (actor: Actor) => actor.id === selectedActorId

  const getListItemContainerStyle = (actor: Actor) => isSelected(actor)
    ? styles.selectedItemContainer
    : NO_STYLES

  const getListItemTextStyle = (actor: Actor) => isSelected(actor)
    ? styles.selectedItemText
    : NO_STYLES

  const createListItem = (actor: Actor) => (
    <List.Item
      key={actor.id}
      description={() => <Text>is {getActionDescription({ characterId: actor.id, frameNumber })}</Text> }
      onPress={handleListPress(actor)}
      style={getListItemContainerStyle(actor)}
      title={actor.name}
      titleStyle={getListItemTextStyle(actor)}
    />
  )

  return (
    <List.Section style={[styles.container, style]}>
      {title && <List.Subheader style={[styles.title, titleStyle]}>{title}</List.Subheader>}
      {map(createListItem)(actors)}
    </List.Section>
  )
}

const container: ViewStyle = {
  // borderWidth: 1,
  // borderColor: '#666',
  backgroundColor: 'white',
  marginBottom: 0,
  marginTop: 0,
}

const selectedItemContainer: ViewStyle = {
  backgroundColor: '#ccc',
}

const selectedItemText: TextStyle = {
  fontWeight: 'bold',
}

const title: TextStyle = {
  backgroundColor: '#ccc',
  borderBottomColor: '#666',
  borderBottomWidth: 1,
}

const styles = StyleSheet.create({
  container,
  selectedItemContainer,
  selectedItemText,
  title,
})
