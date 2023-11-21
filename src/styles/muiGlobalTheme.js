import {
  createTheme 
} from '@mui/material/styles'
import vrbs from './variable.sass'

const globalTheme = createTheme({
  typography: {
    fontFamily: [
      '微軟正黑體',
      'Tahoma',
      'Arial',
    ].join(','),
    fontSize: 14,
  },
  palette: {
    primary: {
      main: vrbs.mainColor,
    },
    // secondary: {
    //   main: vrbs.cSecondary,
    // },
    // error: {
    //   main: vrbs.cError,
    // },
    // warning: {
    //   main: vrbs.cWarning,
    // },
    // info: {
    //   main: vrbs.cInfo,
    // },
    // success: {
    //   main: vrbs.cSuccess,
    // },
  },
})

export default globalTheme
