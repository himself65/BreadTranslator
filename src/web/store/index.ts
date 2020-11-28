import { Display } from '../../../types'

export type GlobalStoreType = {
  // todo: remove 'any'
  displays: readonly Display[]
  getDisplays: (this: GlobalStoreType) => Display[]
  setDisplays: (this: GlobalStoreType, displays: Display[]) => void
}

export const createStore = (): GlobalStoreType => ({
  displays: [],
  getDisplays () {
    return [...this.displays]
  },
  setDisplays (displays) {
    this.displays = displays
  }
})

export const defaultStore = createStore()
