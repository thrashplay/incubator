import React, { Component } from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import 'react-native-gesture-handler'
import { TestScreen } from './components/test-screen'
import { GemstoneProvider } from './game-context/context'
// import { Provider } from 'react-redux'

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
  public render () {
    return (
      // <Provider store={store}>
      <GemstoneProvider>
        <PaperProvider theme={theme}>
          <TestScreen />
        </PaperProvider>
      </GemstoneProvider>
      // </Provider>
    )
  }
}
