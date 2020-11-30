// todo: use loadable component to split code
// import loadable from '@loadable/component'
import { CssBaseline } from '@material-ui/core'
import { observer, useLocalStore } from 'mobx-react'
import React, { Fragment, useEffect } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'

import CapturePage from './page/Capture'
import HomePage from './page/Home'
import LoadingPage from './page/LoadingPage'
import { createStore, globalContext } from './store'
import { globalProxy } from './util'

const GlobalStore: React.FC = ({ children }) => {
  const globalStore = useLocalStore(createStore)
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
    globalProxy.openDefaultPage(history)
  }, [])
  return (
    <Fragment>
      {children}
    </Fragment>
  )
})

export const Global: React.FC = () => {
  return (
    <BrowserRouter>
      <CssBaseline/>
      <GlobalStore>
        <RouteSwitcher>
          <Switch>
            <Route path='/' exact>
              <HomePage/>
            </Route>
            <Route path='/loading'>
              <LoadingPage/>
            </Route>
            <Route page='/capture'>
              <CapturePage/>
            </Route>
          </Switch>
        </RouteSwitcher>
      </GlobalStore>
    </BrowserRouter>
  )
}
