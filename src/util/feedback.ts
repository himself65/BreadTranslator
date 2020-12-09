// todo(unfinished)
import { ipcMain, Notification } from 'electron'

import type { FeedBackConfig, FeedbackOptions } from '../../types'
import { EVENTS } from '../shared'

function globalFeedback (props: FeedbackOptions): Notification {
  const notification = new Notification(props)

  return notification
}

export function feedback (props: FeedbackOptions, config?: FeedBackConfig): Notification | void {
  const {
    global: isGlobal = false
  } = config

  if (isGlobal) {
    return globalFeedback(props)
  } else {
    ipcMain.emit(EVENTS.SHOW_FEEDBACK, props, config)
  }
}
