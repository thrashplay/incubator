import React, { Component } from 'react'
import { Text } from 'react-native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import 'react-native-gesture-handler'
// import { Provider } from 'react-redux'

import { initialize } from '@thrashplay/falcon-firebase'

// import { createApplicationStore } from './store'

// const store = createApplicationStore()

// https://callstack.github.io/react-native-paper/theming.html
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

export class App extends Component {
  constructor (props: any) {
    super(props)
    initialize()
  }

  public render () {
    return (
      // <Provider store={store}>
      <PaperProvider theme={theme}>
        <Text>Hello, from Sophia!</Text>
      </PaperProvider>
      // </Provider>
    )
  }
}
