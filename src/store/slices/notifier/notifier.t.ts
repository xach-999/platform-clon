import {PayloadAction} from "@reduxjs/toolkit"
import {SnackbarOrigin, VariantType} from "notistack"
import {customNotifications} from "./notificationObject"

export type NotifyUserPayload = PayloadAction<{
  message: `${customNotifications}` | string
  variant?: VariantType
  duration?: number
  anchorOrigin?: SnackbarOrigin
}>
