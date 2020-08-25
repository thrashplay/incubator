import React from 'react'
import ReactDOM from 'react-dom'
import materialIconsFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'

import { App } from '@thrashplay/hexmarch-ui'

const iconFontStyles = `@font-face {
  font-family: MaterialCommunityIcons;
  src: url(${materialIconsFont}) format('truetype');
}`

// Create stylesheet
const style = document.createElement('style')
style.type = 'text/css'
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles
} else {
  style.appendChild(document.createTextNode(iconFontStyles))
}

// Inject stylesheet
document.head.appendChild(style)

ReactDOM.render(<App />, document.getElementById('root'))
