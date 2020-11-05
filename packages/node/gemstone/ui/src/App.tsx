import React, { Component } from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import 'react-native-gesture-handler'
import { StoreProvider } from '@thrashplay/gemstone-ui-core'

import { GameScreen } from './components/game-screen'
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
      <StoreProvider>
        <PaperProvider theme={theme}>
          <GameScreen />
        </PaperProvider>
      </StoreProvider>
    )
  }
}
