import { map } from 'lodash/fp'
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import { WithViewStyles } from '../prop-types'

import { ToolName } from './state'

export interface ToolSelectorProps extends WithViewStyles<'style'> {
  onSelect: (name: ToolName) => void
  tools: ToolName[]
}

export const ToolSelector = ({
  onSelect,
  style,
  tools,
}: ToolSelectorProps) => {
  const handlePress = (toolName: ToolName) => () => {
    onSelect(toolName)
  }

  const createButton = (toolName: ToolName) => (
    <Button
      key={toolName}
      compact={true}
      mode="contained"
      onPress={handlePress(toolName)}
      style={styles.button}
    >
      {toolName}
    </Button>
  )

  return (
    <View style={[styles.container, style]}>
      {map(createButton)(tools)}
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
