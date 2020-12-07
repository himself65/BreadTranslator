import type { Display } from 'electron'
import log from 'electron-log'

import type { Display as MyDisplay } from '../../../../types'
import { EVENTS } from '../../../shared'
import { outerStore } from '../../store'
import { GlobalProxy } from '../../util'

const { ipcRenderer } = require('electron')

const getAllDisplays = async () => {
  return ipcRenderer.invoke(EVENTS.GET_ALL_DISPLAYS).then((args: Display[]) => {
    log.log('displays', args)
    outerStore.displays = args.map<MyDisplay>(display => {
      return {
        id: display.id
      }
    })
  })
}

const initProxy = async (proxyOriginal: GlobalProxy) => {
  proxyOriginal.createCaptureWindow = function () {
    // fixme(performance): this call may will stuck the main process
    //  issues: https://zhuanlan.zhihu.com/p/37050595
    ipcRenderer.invoke(EVENTS.CREATE_CAPTURE_WINDOW)
  }

  proxyOriginal.captureWindow = function () {
    ipcRenderer.invoke(EVENTS.CAPTURE_WINDOW).then(async (dataURLPromise: Promise<string>) => {
      const dataURL = await dataURLPromise
      log.log('get dataURL')
      outerStore.imageURL = dataURL
    })
  }

  ipcRenderer.once(EVENTS.LOAD_PAGE, (event, path: string) => {
    log.log(`EVENTS.LOAD_PAGE get '${path}'`)
    outerStore.openPath = path
  })

  ipcRenderer.on(EVENTS.CHANGE_THEME, (event, isDarkMode: boolean) => {
    log.log(`Dark mode enabled: ${isDarkMode}`)
    outerStore.isDarkMode = isDarkMode
  })
}

export async function init (proxyOriginal: GlobalProxy): Promise<void> {
  log.log('electron part init')
  await getAllDisplays()
  await initProxy(proxyOriginal)
}
