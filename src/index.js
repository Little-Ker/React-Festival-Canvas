import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './styles/all.sass'
import {
  Provider 
} from 'react-redux'
import {
  store 
} from './store'
import {
  ThemeProvider 
} from '@mui/material/styles'
import globalTheme from 'styles/muiGlobalTheme'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ThemeProvider theme={globalTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
)

reportWebVitals()
