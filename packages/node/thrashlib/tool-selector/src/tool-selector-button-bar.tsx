import { map } from 'lodash/fp'
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { ToggleButton } from 'react-native-paper'

import { WithViewStyles } from '@thrashplay/react-helpers'

import { Option, ToolSelectorProps } from './tool-selector-props'

export type ToolSelectorButtonBarProps = ToolSelectorProps & WithViewStyles<'style' | 'buttonStyle'>

export const ToolSelectorButtonBar = ({
  buttonStyle,
  onSelect,
  selectedId,
  style,
  options,
}: ToolSelectorButtonBarProps) => {
  const handlePress = (id: string) => () => {
    onSelect(id)
  }

  const createButton = ({ icon, id }: Option) => (
    <ToggleButton
      key={id}
      icon={icon}
      onPress={handlePress(id)}
      status={selectedId === id ? 'checked' : 'unchecked'}
      style={[styles.button, buttonStyle]}
    />
  )

  return (
    <View style={[styles.container, style]}>
      {map(createButton)(options)}
    </View>
  )
}

const button: ViewStyle = {
  marginRight: 16,
}

const container: ViewStyle = {
  flexDirection: 'row',
}

const styles = StyleSheet.create({
  button,
  container,
})
