import PropTypes from 'prop-types'
import React, {
  useCallback, useEffect 
} from 'react'
import useDialogStackContext from 'contexts/dialogStackContext'
import {
  ThemeProvider, createTheme 
} from '@mui/material/styles'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import styles from './alertDialog.module.sass'

const AlertDialog = (props) => {
  const { id, title, content, onOpen, onClose } = props
  const { closeDialog } = useDialogStackContext()

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

  const close = useCallback(() => {
    if ( typeof onClose === 'function' ) {
      onClose()
    }
    closeDialog(id)
  }, [closeDialog, id, onClose])

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
        <DialogActions className={styles.actionBlock}>
          <Button
            size="small"
            className={styles.lightBtn}
            onClick={() => {
              if (onClose) {
                onClose()
              }
              close()
            }}
          >
            {('確定')}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

AlertDialog.propTypes = {
  id: PropTypes.string,
  title: PropTypes.node,
  content: PropTypes.node,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
}

export default AlertDialog
