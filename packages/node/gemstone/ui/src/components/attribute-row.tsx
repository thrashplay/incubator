import { identity } from 'lodash'
import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import { GameState, SelectorParameters } from '@thrashplay/gemstone-engine'
import { useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

export interface AttributeRowProps<TAttribute> extends WithViewStyles<'style'> {
  /** function used to convert the selected value into a string for display */
  format?: (value: TAttribute) => string
  name: string
  selector: (state: GameState, params: SelectorParameters) => TAttribute
  selectorParams?: SelectorParameters
}

/** Displays a styled row with a label, and formatted selector result. */
export const AttributeRow = <TAttribute extends unknown = any>({
  format = identity,
  name,
  selector,
  selectorParams = {},
  style,
}: AttributeRowProps<TAttribute>) => {
  const value = useValue(selector, selectorParams)

  return (
    <View style={[styles.attributeRow, style]}>
      <Text style={styles.attributeLabel}>{name}:</Text>
      <Text style={styles.attributeValue}>{format(value)}</Text>
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

const styles = StyleSheet.create({
  attributeLabel,
  attributeRow,
  attributeValue,
})
