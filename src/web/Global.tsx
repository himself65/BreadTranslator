import {
  AppBar,
  createMuiTheme,
  CssBaseline, Tab,
  Tabs,
  ThemeProvider
} from '@material-ui/core'
import { Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import log from 'electron-log'
import { observer, useLocalObservable } from 'mobx-react'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  useLocation
} from 'react-router-dom'

import { hideBarPaths, pages } from './page'
import { createStore, globalContext, outerStore } from './store'

const GlobalStore: React.FC = ({ children }) => {
  const globalStore = useLocalObservable(createStore)
  return (
    <globalContext.Provider value={globalStore}>
      {children}
    </globalContext.Provider>
  )
}

/**
 * Router switcher, open '/' by default
 */
const RouteSwitcher: React.FC = observer(({ children }) => {
  const history = useHistory()
  useEffect(() => {
    history.push(outerStore.openPath)
  }, [outerStore.openPath])
  return (
    <Fragment>
      {children}
    </Fragment>
  )
})

const useStyles = makeStyles({
  appBar: {
    top: 'auto',
    bottom: 0
  }
})

const GlobalBar: React.FC = observer(() => {
  const classes = useStyles()
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const handleTabsChange = useCallback(
    (event: React.ChangeEvent<unknown>, newValue: string) => {
      log.log('open page:', newValue)
      history.push(newValue)
    }, [history])

  const hidePage = useMemo(() =>
    hideBarPaths.find(page => page === location.pathname) != null
  , [])

  if (hidePage) {
    return null
  }

  return (
    <AppBar position='fixed' color='primary' className={classes.appBar}>
      <Tabs centered defaultValue='/' onChange={handleTabsChange}>
        <Tab
          icon={<HomeIcon/>}
          value='/'
          label={t('home')}
        />
        <Tab
          icon={<SettingsIcon/>}
          value='/settings'
          label={t('settings')}
        />
      </Tabs>
    </AppBar>
  )
})

export const Global: React.FC = observer(() => {
  const theme = useMemo(() => createMuiTheme({
    palette: {
      type: outerStore.isDarkMode ? 'dark' : 'light'
    }
  }), [outerStore.isDarkMode])

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <GlobalStore>
            <RouteSwitcher>
              <Switch>
                {
                  pages.map(page => {
                    return (
                      <Route
                        path={page.path} key={page.path}
                        exact={page.path === '/'}
                      >
                        <page.Component/>
                      </Route>
                    )
                  })
                }
              </Switch>
            </RouteSwitcher>
            <GlobalBar/>
          </GlobalStore>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
})
