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
  Button,
  Box,
  IconButton
} from '@mui/material'
import {
  Close 
} from '@mui/icons-material'
import styles from './infoDialog.module.sass'

const InfoDialog = (props) => {
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
        onBackdropClick={close}
        maxWidth="xl"
      >
        <DialogTitle className={styles.titleBlock}>
          {title}
        </DialogTitle>
        <Box
          position="absolute"
          top={0}
          right={0}
          onClick={close}
        >
          <IconButton>
            <Close />
          </IconButton>
        </Box>
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

InfoDialog.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  id: PropTypes.string,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

export default InfoDialog
