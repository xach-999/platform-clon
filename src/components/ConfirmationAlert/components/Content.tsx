import React, {useState} from "react"
import Button from "@mui/material/Button"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

type ConfirmationAlertButtonColor = "secondary" | "success" | "inherit" | "warning" | "error" | "primary" | "info"

export interface ConfirmationAlertContentProps {
  dialogTitle: string
  dialogContent?: React.ReactNode
  dialogContentText?: string
  confirmText?: string | {
    color: ConfirmationAlertButtonColor
    text: string
  }
  cancelText?: string | {
    color: ConfirmationAlertButtonColor
    text: string
  }
  handleConfirm: () => void
  handleCancel: () => void
}

export default function Content({
  dialogTitle,
  dialogContent,
  dialogContentText,
  confirmText,
  cancelText,
  handleConfirm,
  handleCancel
}: ConfirmationAlertContentProps) {
  const [info] = useState({
    title: dialogTitle,
    content: dialogContent,
    contentText: dialogContentText
  })

  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{p: 4, pb: 2}}>
        {info.title}
      </DialogTitle>
      {(!!info.content || !!info.contentText) && (
        <DialogContent sx={{px: 4}}>
          {!!info.contentText && (
            <DialogContentText>{info.contentText}</DialogContentText>
          )}
          {info.content}
        </DialogContent>
      )}
      <DialogActions sx={{p: 2}}>
        <Button onClick={handleCancel} color={typeof cancelText === "string" ? "primary" : cancelText.color}>
          {(typeof cancelText === "string" ? cancelText : cancelText.text) || "Disagree"}
        </Button>
        <Button
          autoFocus
          onClick={handleConfirm}
          color={typeof confirmText === "string" ? "primary" : confirmText.color}>
          {(typeof confirmText === "string" ? confirmText : confirmText.text) || "Agree"}
        </Button>
      </DialogActions>
    </>
  )
}
