import { Paper } from '@material-ui/core'
import OpenWithIcon from '@material-ui/icons/OpenWith'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.2)'
  },
  dragArea: {
    '-webkit-app-region': 'drag'
  },
  // overwrite the global css
  '@global': {
    'html, body, #app': {
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.2)'
    }
  }
})

export const CapturePage: React.FC = () => {
  const classes = useStyles()
  // todo(unfinished)
  return (
    <Paper className={classes.root}>
      <OpenWithIcon className={classes.dragArea}/>
    </Paper>
  )
}

export default CapturePage
