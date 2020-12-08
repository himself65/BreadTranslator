// only use static string

const EVENTS = {
  OCR_CAPTURE_WINDOW: 'ocr-capture-window',
  CHANGE_THEME: 'change-theme',
  CLOSE_APP: 'close-app',
  CREATE_CAPTURE_WINDOW: 'create-capture-window',
  GET_ALL_DISPLAYS: 'get-all-displays',
  LOAD_PAGE: 'load-page',
  LOG_WORKER_STATUS: 'log-worker-status'
} as const

const PAGES = {
  MAIN: '/',
  LOADING: '/loading',
  CAPTURE: '/capture'
} as const

export {
  EVENTS,
  PAGES
}
