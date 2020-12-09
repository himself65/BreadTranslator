import { BrowserWindow } from 'electron'

import { EVENTS, PAGES } from '../shared'
import { initBrowserWindow } from '../util'
import { entryHtml } from '../util/shared'

export let captureWindow: BrowserWindow = null

export const createCaptureWindow = (): void => {
  if (captureWindow !== null) {
    return
  }
  captureWindow = new BrowserWindow({
    height: 248,
    width: 768,
    resizable: true,
    movable: true,
    frame: false,
    hasShadow: false,
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // use async call, don't stuck the main thread
  captureWindow.loadURL(entryHtml).then(() => {
    captureWindow.webContents.send(EVENTS.LOAD_PAGE, PAGES.CAPTURE)
  })

  initBrowserWindow(captureWindow)
}
