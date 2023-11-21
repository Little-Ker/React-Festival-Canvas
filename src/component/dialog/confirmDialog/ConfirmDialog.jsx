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
import styles from './confirmDialog.module.sass'

const ConfirmDialog = (props) => {
  const { id, content,
    onConfirm, onCancel,
    onOpen, onClose, title } = props
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

  const handleConfirm = useCallback(() =>{
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    close()
  }, [onConfirm, close])

  const handleCancel = useCallback(() =>{
    if (typeof onCancel === 'function') {
      onCancel()
    }
    close()
  }, [onCancel, close])


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
            className={styles.darkBtn}
            onClick={handleCancel}
          >
            {('取消')}
          </Button>
          <Button
            size="small"
            className={styles.lightBtn}
            onClick={handleConfirm}
          >
            {('確定')}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

ConfirmDialog.propTypes = {
  content: PropTypes.node,
  id: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  title: PropTypes.node,
}

export default ConfirmDialog
