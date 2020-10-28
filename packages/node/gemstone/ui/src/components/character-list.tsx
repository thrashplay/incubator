import { map, noop } from 'lodash/fp'
import React, { useState } from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { List } from 'react-native-paper'

import { Character, CharacterId } from '@thrashplay/gemstone-engine'

const NO_STYLES = {}

export interface CharacterListProps {
  /** list of actors to include in the list */
  characters?: Character[]

  /** the actor to initially select (onSelect is not called for this initial selection) */
  initialSelection?: Character

  /** callback notified when an actor is selected */
  onSelect?: (id: CharacterId) => void

  /** style to apply to the list's container */
  style?: StyleProp<ViewStyle>

  /** optional title string to display above the list */
  title?: string

  /** style to use for the title */
  titleStyle?: StyleProp<TextStyle>
}

export const CharacterList = ({
  characters = [],
  initialSelection,
  onSelect = noop,
  style,
  title,
  titleStyle,
}: CharacterListProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(initialSelection)

  const handleListPress = (character: Character) => () => {
    onSelect(character.id)
    setSelectedCharacter(character)
  }

  const isSelected = (character: Character) => character.id === selectedCharacter?.id

  const getListItemContainerStyle = (character: Character) => isSelected(character)
    ? styles.selectedItemContainer
    : NO_STYLES

  const getListItemTextStyle = (character: Character) => isSelected(character)
    ? styles.selectedItemText
    : NO_STYLES

  const createListItem = (character: Character) => (
    <List.Item
      key={character.id}
      onPress={handleListPress(character)}
      style={getListItemContainerStyle(character)}
      title={character.name}
      titleStyle={getListItemTextStyle(character)}
    />
  )

  return (
    <List.Section style={[styles.container, style]}>
      {title && <List.Subheader style={[styles.title, titleStyle]}>{title}</List.Subheader>}
      {map(createListItem)(characters)}
    </List.Section>
  )
}

const container: ViewStyle = {
  // borderWidth: 1,
  // borderColor: '#666',
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
