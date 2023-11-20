import PropTypes from 'prop-types'
import React, {
  useEffect 
} from 'react'
import {
  ThemeProvider,
  createTheme 
} from '@mui/material/styles'
import {
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import styles from './formDialog.module.sass'

const FormDialog = (props) => {
  const { id, title, content, onOpen, onClose } = props

  const moduleTheme = {
    components: {
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            background: '#575757',
            color: '#fff',
          },
        },
      },
    },
  }

  useEffect(() => {
    if (typeof onOpen === 'function') {
      onOpen()
    }
  }, [onOpen, id])

  return (
    <ThemeProvider theme={theme=>createTheme(theme, moduleTheme)}>
      <Dialog
        className={styles.root}
        open={true}
        onClose={onClose}
        maxWidth="xl"
      >
        <DialogTitle className={styles.titleBlock}>
          {title}
        </DialogTitle>
        <DialogContent
          className={styles.contentBlock}
          dividers
        >
          {content}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}

FormDialog.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  id: PropTypes.string,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

export default FormDialog
