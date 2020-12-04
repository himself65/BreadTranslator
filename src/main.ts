import { app, BrowserWindow, ipcMain, screen } from 'electron'
import * as log from 'electron-log'
import * as path from 'path'

import { EVENTS, PAGES } from './shared'
import {
  captureBrowserWindow,
  createCaptureWindow,
  initBrowserWindow
} from './util'
import isDev = require('electron-is-dev')

// fixme(bug): disable this for this will impact the transparent BrowserWindow
// require('electron-debug')({
//   isEnabled: isDev
// })

if (isDev) {
  log.debug('dev mode')
  log.levels.add('debug')
} else {
  log.debug('production mode')
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, '..', 'node_modules', 'electron')
  })
}

let mainWindow: BrowserWindow = null

async function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  initBrowserWindow(mainWindow)

  await mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
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

ipcMain.handle(EVENTS.GET_ALL_DISPLAYS, () => {
  return screen.getAllDisplays()
})

// fixme(performance): this call may will stuck the main process
//  issues: https://zhuanlan.zhihu.com/p/37050595
ipcMain.handle(EVENTS.CREATE_CAPTURE_WINDOW, createCaptureWindow)
ipcMain.handle(EVENTS.CAPTURE_WINDOW, captureBrowserWindow)

app.whenReady().then(createMainWindow)
