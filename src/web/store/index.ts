import log from 'electron-log'
import React from 'react'

import { Display, Optional } from '../../../types'

type PureStore = {
  displays: Display[]
}

export const globalContext = React.createContext<ReturnType<typeof createStore>>(null)

// fixme(type): remove 'as'
export const defaultStore: Optional<PureStore> = {}

export const createStore = () => ({
  displays: [] as Display[],
  ...defaultStore,
  getDisplays (): Display[] {
    return [...this.displays]
  },
  setDisplays (displays): void {
    this.displays = displays
  }
})

export function useGlobalStore (): ReturnType<typeof createStore> {
  const store = React.useContext(globalContext)
  if (!store) {
    // todo
    const error = new ReferenceError('globalContext not exist')
    log.error(error)
    throw error
  }
  return store
}
