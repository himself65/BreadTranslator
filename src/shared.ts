const EVENTS = {
  CHANGE_THEME: 'change-theme',
  CLOSE_APP: 'close-app',
  CREATE_CAPTURE_WINDOW: 'create-capture-window',
  GET_ALL_DISPLAYS: 'get-all-displays',
  LOAD_PAGE: 'load-page'
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
