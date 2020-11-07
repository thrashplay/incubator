import { TextStyle, ViewStyle } from 'react-native'

const content: ViewStyle = {
  padding: 16,
}

const firstRow: ViewStyle = {
  marginTop: 0,
}

const title: TextStyle = {
  backgroundColor: '#ccc',
  borderBottomColor: '#666',
  borderBottomWidth: 1,
  padding: 16,
}

const smallOptionButton: ViewStyle = {
  paddingLeft: 0,
  paddingRight: 0,
}

const smallOptionButtonText: TextStyle = {
  fontSize: 10,
}

const smallOptionButtonSelectedText: TextStyle = {
  ...smallOptionButtonText,
  color: 'black',
  fontWeight: 'bold',
}

const smallOptionRow: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
}

export const InspectPanelStyles = {
  content,
  firstRow,
  smallOptionButton,
  smallOptionButtonSelectedText,
  smallOptionButtonText,
  smallOptionRow,
  title,
}
