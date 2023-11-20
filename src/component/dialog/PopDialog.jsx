import React, {
  Suspense, useEffect 
} from 'react'
import {
  ThemeProvider, useTheme 
} from '@mui/material/styles'
import PropsContext from 'contexts/propsContext'
import DialogStack from 'component/dialog/dialogStack'

const PopDialog = (props) => {
  /** 外部環境的 theme */
  const defaultTheme = useTheme()

  useEffect(() => {
    console.log('!!!!!!')
  }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="popDialog">
        <Suspense fallback="">
          <PropsContext.Provider value={{ ...props }}>
            <DialogStack />
          </PropsContext.Provider>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}


export default PopDialog
