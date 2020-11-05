import React, { PropsWithChildren } from 'react'

import { WithFrameQuery } from '../with-frame-query'

export const FrameContext = React.createContext<WithFrameQuery>({})

export const FrameProvider = ({ children, frameQuery }: PropsWithChildren<WithFrameQuery>) => {
  return (
    <FrameContext.Provider value={{ frameQuery }}>
      {children}
    </FrameContext.Provider>
  )
}
