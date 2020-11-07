import { map, noop } from 'lodash/fp'
import React, { } from 'react'
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { List } from 'react-native-paper'

import { Area, getBasicAreaDescription } from '@thrashplay/gemstone-map-model'
import { useSelector } from '@thrashplay/gemstone-ui-core'
import { WithTextStyles, WithViewStyles } from '@thrashplay/react-helpers'

const NO_STYLES = {}

export interface AreaListProps extends WithTextStyles<'titleStyle'>, WithViewStyles<'style'> {
  /** Array of areas to include in the list */
  areas?: Area[]

  /** Area to initially select (onSelect is not called for this initial selection) */
  selectedAreaId?: Area['id']

  /** Callback notified when an area is selected */
  onSelect?: (id: Area['id']) => void

  /** Optional title string to display above the list */
  title?: string
}

export const AreaList = ({
  areas,
  onSelect = noop,
  selectedAreaId,
  style,
  title,
  titleStyle,
}: AreaListProps) => {
  const selectBasicAreaDescription = useSelector(getBasicAreaDescription)

  const handleListPress = (area: Area) => () => {
    onSelect(area.id)
  }

  const isSelected = (area: Area) => area.id === selectedAreaId

  const getListItemContainerStyle = (area: Area) => isSelected(area)
    ? styles.selectedItemContainer
    : NO_STYLES

  const getListItemTextStyle = (area: Area) => isSelected(area)
    ? styles.selectedItemText
    : NO_STYLES

  const createListItem = (area: Area) => (
    <List.Item
      key={area.id}
      description={() => <Text>{selectBasicAreaDescription({ areaId: area.id })}</Text>}
      onPress={handleListPress(area)}
      style={getListItemContainerStyle(area)}
      title={`Area #${area.id}`}
      titleStyle={getListItemTextStyle(area)}
    />
  )

  return (
    <List.Section style={[styles.container, style]}>
      {title && <List.Subheader style={[styles.title, titleStyle]}>{title}</List.Subheader>}
      <ScrollView>
        {map(createListItem)(areas)}
      </ScrollView>
    </List.Section>
  )
}

const container: ViewStyle = {
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
