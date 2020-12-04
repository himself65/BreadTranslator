import { BrowserWindow, desktopCapturer, Display, nativeTheme, screen } from 'electron'
import log from 'electron-log'
import * as path from 'path'

import { EVENTS, PAGES } from '../shared'

let captureWindow: BrowserWindow = null

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

function getCurrentScreen (browserWindow: BrowserWindow): Display {
  const bounds = browserWindow.getBounds()
  return screen.getAllDisplays().find(display => {
    const displayBounds = display.bounds
    const borderX = displayBounds.x + displayBounds.width
    const borderY = displayBounds.y + displayBounds.height
    const leftTop = (bounds.x < borderX) && (bounds.y < borderY)
    const rightBottom = (bounds.x + bounds.width < borderX) && (bounds.y + bounds.height < borderY)
    return leftTop && rightBottom
  })
}

export const captureBrowserWindow = (): void => {
  if (captureWindow === null) {
    return
  }
  const currentScreen = getCurrentScreen(captureWindow)
  if (currentScreen == null) {
    log.log('cannot find the screen')
  }

  desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
    const source = sources.find(source => source.display_id === `${currentScreen.id}`)
    // todo(unfinished)
  })
}

export const createCaptureWindow = (): void => {
  if (captureWindow !== null) {
    return
  }
  captureWindow = new BrowserWindow({
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
