import create from 'zustand'
import {
  v4 as uuid 
} from 'uuid'

const useDialogStackContext = create(set => ({
  popDialogs: [],
  openAlert: (props) => {
    const id = uuid()
    const type = 'ALERT'
    const { title, content, handlers } = props
    const { onOpen = null, onClose = null } = handlers ? handlers : {}
    set((state) => {
      const newDialog = {
        id,
        type,
        title,
        content,
        onOpen,
        onClose,
      }
      const newState = { ...state }
      newState.popDialogs.push(newDialog)
      return newState
    })
    return id
  },
  openConfirm: (title, content, onConfirm, onCancel, handlers) => {
    const id = uuid()
    const type = 'CONFIRM'
    const { onOpen = null, onClose = null } = handlers ? handlers : {}
    set((state) => {
      const newDialog = {
        id,
        type,
        title,
        content,
        onConfirm,
        onCancel,
        onOpen,
        onClose,
      }
      const newState = { ...state }
      newState.popDialogs.push(newDialog)
      return newState
    })
    return id
  },
  openForm: (props) => {
    const id = uuid()
    const type = 'FORM'
    const { title, content, footer, handlers } = props
    const { onOpen = null, onClose = null } = handlers ? handlers : {}
    set((state) =>{
      const newDialog = {
        id,
        type,
        title,
        content,
        footer,
        onOpen,
        onClose,
      }
      const newState = { ...state }
      newState.popDialogs.push(newDialog)
      return newState
    })
    return id
  },
  openInfo: (props) => {
    const id = uuid()
    const type = 'INFO'
    const { title, content } = props
    set((state) => {
      const newDialog = {
        id,
        type,
        title,
        content,
      }
      const newState = { ...state }
      newState.popDialogs.push(newDialog)
      return newState
    })
    return id
  },
  closeDialog: (id) => {
    if (id !== null && id !== undefined && typeof id === 'string') {
      // 若指定 ID, 可將指定 ID 的 Dialog 關掉
      set((state) => {
        const pos = state.popDialogs.findIndex(cur => cur.id === id)
        if (pos !== -1) {
          const newState = { ...state }
          newState.popDialogs.splice(pos, 1)
          return newState
        }
        return state
      })
    } else {
      // 否則只關掉最上層的 Dialog
      set((state) => {
        const newState = { ...state }
        newState.popDialogs.pop()
        return newState
      })
    }
  },
  closeDialogs: (id) => {
    if (id !== null && id !== undefined) {
      // 若指定 ID, 可將指定 ID 以後的 Dialog 都關掉
      set((state) => {
        const pos = state.popDialogs.findIndex(cur => cur.id === id)
        if (pos !== -1) {
          const newState = { ...state }
          newState.popDialogs.splice(pos)
          return newState
        }
        return state
      })
    } else {
      // 否則會將所有 Dialog 都關掉
      set((state) => {
        const newState = { ...state }
        newState.popDialogs = []
        return newState
      })
    }
  },
}))

export default useDialogStackContext

