import log from 'electron-log'
import type { ImageLike } from 'tesseract.js'

import { EVENTS } from '../../../shared'
import { OCRModule } from '../index'

export function init (): Promise<OCRModule> {
  return Promise.all([
    import('electron'),
    import('tesseract.js')
  ]).then(async ([electron, tesseract]) => {
    const { ipcMain } = electron
    const { createWorker } = tesseract
    const worker = createWorker({
      logger: arg => {
        log.debug(arg)
        ipcMain.emit(EVENTS.LOG_WORKER_STATUS, arg)
      }
    })
    await worker.load()
    await worker.loadLanguage('eng+jpn')
    await worker.initialize('eng+jpn')
    return {
      recognize (url: ImageLike) {
        return worker.recognize(url).then(res => res.data.text)
      },
      async unregister () {
        await worker.terminate()
      }
    }
  })
}
