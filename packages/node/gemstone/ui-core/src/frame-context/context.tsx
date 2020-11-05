import React, { PropsWithChildren } from 'react'

import { WithFrameQuery } from '../components/prop-types'

export const FrameContext = React.createContext<WithFrameQuery>({})

export const FrameProvider = ({ children, frameQuery }: PropsWithChildren<WithFrameQuery>) => {
  return (
    <FrameContext.Provider value={{ frameQuery }}>
      {children}
    </FrameContext.Provider>
  )
}
