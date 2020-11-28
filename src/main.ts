'use strict'

import { app, BrowserWindow } from 'electron'
import isDev = require('electron-is-dev')
import * as path from 'path'

const debug = require('debug')('bread-translator:host')

if (isDev) {
  debug('dev mode')
} else {
  debug('production mode')
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, '..', 'node_modules', 'electron')
  })
}

let mainWindow: BrowserWindow = null

async function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  await mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)
}

app.on('activate', () => {
  // fixes for macOS
  if (mainWindow == null) {
    createWindow().then()
  }
})

app.whenReady().then(createWindow)
