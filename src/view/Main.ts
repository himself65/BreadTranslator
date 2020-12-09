import { app, BrowserWindow, ipcMain } from 'electron'

import { EVENTS, PAGES } from '../shared'
import { initBrowserWindow } from '../util'
import { entryHtml } from '../util/shared'
export let mainWindow: BrowserWindow = null

export async function createMainWindow (): Promise<void> {
  mainWindow = new BrowserWindow({
    // use iPhone X size
    width: 375,
    height: 812,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  initBrowserWindow(mainWindow)

  await mainWindow.loadURL(entryHtml)
  mainWindow.webContents.send(EVENTS.LOAD_PAGE, PAGES.MAIN)

  mainWindow.on('close', () => {
    ipcMain.emit(EVENTS.CLOSE_APP)
  })

  app.on('activate', () => {
    // fixes for macOS
    if (mainWindow == null) {
      createMainWindow().then()
    }
  })
}
