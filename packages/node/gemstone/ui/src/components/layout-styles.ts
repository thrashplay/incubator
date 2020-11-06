import { StyleSheet, ViewStyle } from 'react-native'

const container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'stretch',
}

const mapView: ViewStyle = {
  flexGrow: 1,
}

const sidebar: ViewStyle = {
  flexDirection: 'column',
  marginRight: 8,
  width: 300,
}

export const LayoutStyles = StyleSheet.create({
  container,
  mapView,
  sidebar,
})
