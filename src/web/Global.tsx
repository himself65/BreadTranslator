import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { observer, useLocalObservable } from 'mobx-react'
import React, { Fragment, useEffect } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'

// bug(parcel): code split not work with parcel using TypeScript, might be fixed in parcel v2
//  issues: https://github.com/parcel-bundler/parcel/issues/1547, https://github.com/parcel-bundler/website/issues/546
import Capture from './page/Capture'
import Home from './page/Home'
import Loading from './page/Loading'
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

const pages = [
  {
    path: '/',
    Component: Home
  },
  {
    path: '/capture',
    Component: Capture
  },
  {
    path: '/loading',
    Component: Loading
  }
]

// todo(feature): load theme from the main thread
const theme = createMuiTheme({})

export const Global: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <GlobalStore>
          <RouteSwitcher>
            <Switch>
              {
                pages.map(page => {
                  return (
                    <Route path={page.path} key={page.path} exact={page.path === '/'}>
                      <page.Component/>
                    </Route>
                  )
                })
              }
            </Switch>
          </RouteSwitcher>
        </GlobalStore>
      </ThemeProvider>
    </BrowserRouter>
  )
}
