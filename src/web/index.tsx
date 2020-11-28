import React from 'react'
import ReactDOM from 'react-dom'
import { Home } from './Home'

// tip: in parcel v1, dynamic import doesn't work
// todo: fix this when upgrade to parcel v2
import './init/electron/index'

ReactDOM.render(<Home/>, document.getElementById('root'))
