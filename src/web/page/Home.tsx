import { Button, Paper } from '@material-ui/core'
import React, { useCallback } from 'react'

import { globalProxy } from '../util'

// todo(unfinished)
export const HomePage: React.FC = () => {
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
    </Paper>
  )
}

export default HomePage
