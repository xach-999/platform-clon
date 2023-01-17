import Dialog from "@mui/material/Dialog"
import DialogTransition from "components/DialogTransition"
import React from "react"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CustomModal({
  open,
  onClose,
  children
}: React.PropsWithChildren<Props>) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      TransitionComponent={DialogTransition}>
      {children}
    </Dialog>
  )
}
