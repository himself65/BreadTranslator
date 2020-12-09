import React from 'react'

// bug(parcel): code split not work with parcel using TypeScript, might be fixed in parcel v2
//  issues: https://github.com/parcel-bundler/parcel/issues/1547, https://github.com/parcel-bundler/website/issues/546
import Capture from './page/Capture'
import Home from './page/Home'
import Loading from './page/Loading'
import Settings from './page/Settings'

export type Page = {
  path: string
  Component: React.FC
}

export const pages: Page[] = [
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
  },
  {
    path: '/settings',
    Component: Settings
  }
]

export const hideBarPaths = [
  '/capture'
]
