import {createSlice} from "@reduxjs/toolkit"
import {errObject} from "./errorObject"
import {notificationObject} from "./notificationObject"
import {NotifyUserPayload} from "./notifier.t"
import CustomErrorClass from "./customErrorClass"

const getMessageFromError = (err) => {
  if (err instanceof CustomErrorClass) return err.message

  let msg = err?.data?.error?.message || err?.data?.error || err?.data || err
  if (typeof msg !== "string") msg = err?.data?.message
  if (typeof msg !== "string") msg = err?.message
  if (typeof msg !== "string")
    msg = err?.data?.error?.message || err?.data?.error

  return msg
}

export const initialState = {
  errorMessage: {message: "", variant: "error"},
  notificationMessage: {message: "", variant: "success"},
  duration: 3000,
  anchorOrigin: {
    vertical: "top",
    horizontal: "center"
  }
}

const notifierSlice = createSlice({
  name: "notifierSlice",
  initialState: initialState,
  reducers: {
    handleError: (state, {payload}) => {
      let msg = getMessageFromError(payload)

      if (errObject[msg] && errObject[msg]?.duration) {
        state.duration = errObject[msg].duration
      }

      if (errObject[msg] && errObject[msg]?.message) {
        msg = errObject[msg].message
      }

      state.errorMessage = {
        message: typeof msg === "string" ? msg : "Unexpected error",
        variant: "error"
      }
    },
    notifyUser: (state, {payload}: NotifyUserPayload) => {
      state.notificationMessage = {
        message: notificationObject[payload?.message] || payload?.message,
        variant: payload?.variant || "success"
      }
      state.duration = payload?.duration || 3000
    },
    cleanNotifierMessages: (state) => {
      state.errorMessage = {message: "", variant: "error"}
      state.notificationMessage = {message: "", variant: "success"}
      state.duration = 3000
    }
  }
})

export const {handleError, cleanNotifierMessages, notifyUser} =
  notifierSlice.actions

export default notifierSlice.reducer
