import {useEffect, useState} from "react"
import {useSnackbar, VariantType} from "notistack"
import {useDispatch, useSelector} from "store"
import {cleanNotifierMessages} from "store/slices/notifier/notifier"

export default function PracticeNotify() {
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const dispatch = useDispatch()
  const [snackKey, setSnackKey] = useState(null)

  const {errorMessage, notificationMessage, duration} = useSelector(
    (state) => state.notifierSlice
  )

  useEffect(() => {
    if (!errorMessage?.message) return
    const {message} = errorMessage
    const snackKey = enqueueSnackbar(message, {
      anchorOrigin: {
        horizontal: "right",
        vertical: "top"
      },
      variant: "error"
    })
    setSnackKey(snackKey)
  }, [errorMessage])

  useEffect(() => {
    if (!notificationMessage?.message) return

    const {message, variant} = notificationMessage || {}
    const snackKey = enqueueSnackbar(message, {
      anchorOrigin: {
        horizontal: "right",
        vertical: "top"
      },
      variant: variant as VariantType
    })

    setSnackKey(snackKey)
  }, [notificationMessage])

  useEffect(() => {
    if (!snackKey) return

    setTimeout(() => {
      closeSnackbar(snackKey)
      dispatch(cleanNotifierMessages())
      setSnackKey(null)
    }, duration || 3000)
  }, [snackKey])

  return null
}
