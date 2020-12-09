import './i18n'

import React from 'react'
import ReactDOM from 'react-dom'

import { Global } from './Global'
// tip: in parcel v1, dynamic import doesn't work
// todo: fix this when upgrade to parcel v2
import { init } from './init/electron'
import { proxyOriginal } from './util'

init(proxyOriginal).then(() => console.log('initialized'))

ReactDOM.render(<Global/>, document.getElementById('root'))
