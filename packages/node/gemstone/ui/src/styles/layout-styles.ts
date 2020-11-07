import { ViewStyle } from 'react-native'

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

const sidebarDetails: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexGrow: 1,
  marginTop: 8,
}

const sidebarList: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexBasis: 0,
  flexGrow: 3,
}

export const LayoutStyles = {
  container,
  mapView,
  sidebar,
  sidebarDetails,
  sidebarList,
}
