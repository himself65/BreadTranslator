import { app, ipcMain, screen } from 'electron'
import * as log from 'electron-log'
import * as path from 'path'

import { EVENTS } from './shared'
import {
  captureBrowserWindow
} from './util'
import { captureWindow, createCaptureWindow } from './view/Capture'
import { createMainWindow } from './view/Main'
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

ipcMain.handle(EVENTS.GET_ALL_DISPLAYS, () => {
  return screen.getAllDisplays()
})

// fixme(performance): this call may will stuck the main process
//  issues: https://zhuanlan.zhihu.com/p/37050595
ipcMain.handle(EVENTS.CREATE_CAPTURE_WINDOW, createCaptureWindow)
ipcMain.handle(EVENTS.OCR_CAPTURE_WINDOW, () => {
  captureBrowserWindow(captureWindow).then()
})

app.whenReady().then(createMainWindow)
