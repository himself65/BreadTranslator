import { app, BrowserWindow, ipcMain, screen } from 'electron'
import * as log from 'electron-log'
import * as path from 'path'

import { EVENTS, PAGES } from './shared'
import isDev = require('electron-is-dev')

require('electron-debug')({
  isEnabled: isDev
})

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

  await mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.send(EVENTS.LOAD_PAGE, PAGES.MAIN)
  })

  mainWindow.on('close', () => {
    mainWindow = null
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

app.whenReady().then(createMainWindow)
