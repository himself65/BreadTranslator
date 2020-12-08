import {
  BrowserWindow,
  desktopCapturer,
  Display,
  NativeImage,
  nativeTheme,
  Rectangle,
  screen
} from 'electron'
import log from 'electron-log'

import { EVENTS } from '../shared'
import OCR from './ocr'

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
    const rightBottom = (bounds.x + bounds.width < borderX) &&
      (bounds.y + bounds.height < borderY)
    return leftTop && rightBottom
  })
}

export const getCaptureBrowserWindowImage = async (captureWindow: BrowserWindow): Promise<NativeImage> => {
  const currentScreen = getCurrentScreen(captureWindow)
  if (currentScreen === null) {
    log.log('cannot find the screen')
  }

  function getBounds (windowBounds: Rectangle, displayBounds: Rectangle): Rectangle {
    return {
      // calculate the position
      x: windowBounds.x - displayBounds.x,
      y: windowBounds.y - displayBounds.y,
      height: windowBounds.height,
      width: windowBounds.width
    }
  }

  const targetBounds = getBounds(captureWindow.getBounds(), currentScreen.bounds)
  log.log('get sources')
  captureWindow.hide()
  return desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: currentScreen.bounds.width,
      height: currentScreen.bounds.height
    }
  }).then(async sources => {
    captureWindow.show()
    const source = sources.find(
      source => source.display_id === `${currentScreen.id}`)
    log.log('source found')
    return source.thumbnail.crop(targetBounds)
  })
}

const ocr = new OCR('google')
export const getImageText = async (image: NativeImage | string): Promise<string> => {
  let dataURL = ''
  if (typeof image === 'string') {
    dataURL = image
  } else {
    dataURL = image.toDataURL()
  }
  return ocr.recognize(dataURL)
}

export const captureBrowserWindow = (captureWindow: BrowserWindow): Promise<{ text: string; dataURL: string }> => {
  return getCaptureBrowserWindowImage(captureWindow).then(async image => {
    return {
      text: await getImageText(image),
      dataURL: image.toDataURL()
    }
  })
}
