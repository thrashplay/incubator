import { map, noop } from 'lodash/fp'
import React, { useState } from 'react'
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { List } from 'react-native-paper'

import { getPublicActionDescription } from '@thrashplay/gemstone-engine'
import { Actor, CharacterId, getActors } from '@thrashplay/gemstone-model'

import { useFrameQuery } from '../frame-context'
import { useSelector, useValue } from '../store'

import { WithTextStyles, WithViewStyles } from './prop-types'

const NO_STYLES = {}

export interface ActorListProps extends WithTextStyles<'titleStyle'>, WithViewStyles<'style'> {
  /** list of actors to include in the list */
  actors?: Actor[]

  /** the actor to initially select (onSelect is not called for this initial selection) */
  initialSelection?: Actor

  /** callback notified when an actor is selected */
  onSelect?: (id: CharacterId) => void

  /** optional title string to display above the list */
  title?: string
}

export const ActorList = ({
  initialSelection,
  onSelect = noop,
  style,
  title,
  titleStyle,
}: ActorListProps) => {
  const frameQuery = useFrameQuery()
  const getActionDescription = useSelector(getPublicActionDescription)
  const [selectedActorId, setSelectedActorId] = useState<string | undefined>(initialSelection?.id)

  const actors = useValue(getActors, frameQuery)

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
      description={() => <Text>is {getActionDescription({
        ...frameQuery,
        characterId: actor.id,
      })}</Text> }
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
