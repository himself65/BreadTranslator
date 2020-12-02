import { BrowserWindow, nativeTheme } from 'electron'
import * as path from 'path'

import { EVENTS, PAGES } from '../shared'

export function initBrowserWindow (browserWindow: BrowserWindow): void {
  browserWindow.on('ready-to-show', () => {
    const isDarkMode = nativeTheme.shouldUseDarkColors
    browserWindow.webContents.send(EVENTS.CHANGE_THEME, isDarkMode)
    browserWindow.show()
  })

  browserWindow.on('close', () => {
    browserWindow = null
  })
}

export const createCaptureWindow = (): void => {
  const captureWindow = new BrowserWindow({
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
  captureWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
    .then(() => {
      captureWindow.webContents.send(EVENTS.LOAD_PAGE, PAGES.CAPTURE)
    })

  initBrowserWindow(captureWindow)
}
