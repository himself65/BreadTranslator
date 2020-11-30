import type { Display } from 'electron'
import log from 'electron-log'

import type { Display as MyDisplay } from '../../../../types'
import { EVENTS } from '../../../shared'
import { defaultStore } from '../../store'
import { GlobalProxy } from '../../util'

const { ipcRenderer } = require('electron')

const getAllDisplays = async () => {
  return ipcRenderer.invoke(EVENTS.GET_ALL_DISPLAYS).then((args: Display[]) => {
    log.log('displays', args)
    defaultStore.displays = args.map<MyDisplay>(display => {
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
  let defaultPath = '/'
  ipcRenderer.once(EVENTS.LOAD_PAGE, (event, path: string) => {
    // fixme(bug): sometimes cannot open the page
    log.log(`EVENTS.LOAD_PAGE get '${path}'`)
    defaultPath = path
  })
  proxyOriginal.openDefaultPage = function (history) {
    history.push(defaultPath)
  }
}

export async function init (proxyOriginal: GlobalProxy): Promise<void> {
  log.log('electron part init')
  await getAllDisplays()
  await initProxy(proxyOriginal)
}
