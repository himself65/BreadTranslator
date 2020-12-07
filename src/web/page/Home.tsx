import { Button, Paper } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'

import { outerStore } from '../store'
import { globalProxy } from '../util'

// todo(unfinished)
export const HomePage: React.FC = observer(() => {
  const createCaptureWindow = useCallback(() => {
    globalProxy.createCaptureWindow()
  }, [])
  const captureWindow = useCallback(() => {
    globalProxy.captureWindow()
  }, [])

  return (
    <Paper>
      <Button onClick={createCaptureWindow}>
        创建捕获区域
      </Button>
      <Button onClick={captureWindow}>
        截图
      </Button>
      <img src={outerStore.imageURL} alt=''/>
    </Paper>
  )
})

export default HomePage
