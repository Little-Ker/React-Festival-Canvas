import useDialogStackContext from 'contexts/dialogStackContext'

const {
  openAlert,
  openConfirm,
  openForm,
  openInfo,
  closeDialog,
  closeDialogs,
} = useDialogStackContext.getState()


export { default } from './PopDialog'
export { useDialogStackContext as useDialogContext,
  openAlert,
  openConfirm,
  openForm,
  openInfo,
  closeDialog,
  closeDialogs}
