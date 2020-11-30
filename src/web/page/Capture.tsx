import '../css/index.less'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%'
  },
  dragArea: {
    '-webkit-app-region': 'drag'
  }
})

export const CapturePage: React.FC = () => {
  const classes = useStyles()
  // todo(unfinished)
  return (
    <Paper className={`${classes.root} ${classes.dragArea}`}>
      Capture Page
    </Paper>
  )
}

export default CapturePage
