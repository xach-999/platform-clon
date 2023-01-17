import DialogTransition from "components/DialogTransition"
import React from "react"
import Dialog from "@mui/material/Dialog"
import Content, {ConfirmationAlertContentProps} from "./components/Content"

interface Props extends ConfirmationAlertContentProps {
  isOpen: boolean
  setOpen: (status: boolean) => void
}

export default function ConfirmationAlert({
  isOpen,
  setOpen,
  dialogTitle,
  dialogContent,
  dialogContentText,
  confirmText,
  cancelText,
  handleConfirm,
  handleCancel
}: Props) {
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    handleConfirm()
    setOpen(false)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={DialogTransition}>
      <Content
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        dialogContentText={dialogContentText}
        cancelText={cancelText}
        confirmText={confirmText}
        handleCancel={handleCancel}
        handleConfirm={handleSubmit}
      />
    </Dialog>
  )
}
