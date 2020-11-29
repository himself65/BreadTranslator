import type { Display } from 'electron'
import * as log from 'electron-log'

import type { Display as MyDisplay } from '../../../../types'
import { EVENTS } from '../../../shared'
import { defaultStore } from '../../store'

const { ipcRenderer } = require('electron')

const getAllDisplays = async () => {
  return ipcRenderer.invoke(EVENTS.GET_ALL_DISPLAYS).then((args: Display[]) => {
    log.log('displays', args)
    const displays = args.map<MyDisplay>(display => {
      return {
        id: display.id
      }
    })
    defaultStore.setDisplays(displays)
  })
}

export async function init (): Promise<void> {
  log.log('electron part init')
  await getAllDisplays()
}
