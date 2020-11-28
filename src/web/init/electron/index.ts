import type { Display } from 'electron'
import * as log from 'electron-log'

import { EVENTS } from '../../../shared'
import { defaultStore } from '../../store'

const { ipcRenderer } = require('electron')

export function init (): void {
  log.log('electron part init')

  ipcRenderer.on(EVENTS.GET_ALL_DISPLAYS, (event, args: Display[]) => {
    log.log('displays', args)
    const displays = args.map(display => {
      return {
        id: display.id
      }
    })
    defaultStore.setDisplays(displays)
  })
}
