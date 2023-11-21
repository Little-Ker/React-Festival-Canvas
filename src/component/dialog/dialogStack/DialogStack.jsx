import React from 'react'
import useDialogStackContext from 'contexts/dialogStackContext'
import AlertDialog from 'component/dialog/alertDialog'
import ConfirmDialog from 'component/dialog/confirmDialog'
import FormDialog from 'component/dialog/formDialog'
import InfoDialog from 'component/dialog/infoDialog'
import styles from './dialogStack.module.sass'

const DialogStack = () => {
  const { popDialogs } = useDialogStackContext()

  return (
    <div className={styles.root}>
      {popDialogs?.map((curProps) => {
        switch (curProps.type) {
        case 'ALERT':
          return (
            <AlertDialog
              key={curProps.id}
              {...curProps}
            />
          )
        case 'CONFIRM':
          return (
            <ConfirmDialog
              key={curProps.id}
              {...curProps}
            />
          )
        case 'FORM':
          return (
            <FormDialog
              key={curProps.id}
              {...curProps}
            />
          )
        case 'INFO':
          return (
            <InfoDialog
              key={curProps.id}
              {...curProps}
            />
          )
        default:
        }
      })}
    </div>
  )
}

export default DialogStack
