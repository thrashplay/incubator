import { StyleProp, ViewStyle } from 'react-native'

export type WithViewStyles<TStyle extends string> = {
  /** style to apply to the element with the specified type */
  [k in TStyle]?: StyleProp<ViewStyle>
}
