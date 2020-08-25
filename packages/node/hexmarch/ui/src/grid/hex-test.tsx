import { map } from 'lodash/fp'
import React, { useCallback } from 'react'
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

export const HexTest: React.FC = () => {
  return (
    <div>hello</div>
  )
}

const container: ViewStyle = {
  backgroundColor: '#ecf0f1',
  flex: 1,
  minWidth: 300,
  padding: 8,
}

const initiativeGroup: ViewStyle = {
  marginBottom: 8,
}

const styles = StyleSheet.create({
  container,
  initiativeGroup,
})
