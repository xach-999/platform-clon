import {ButtonTypeMap, DialogProps} from "@mui/material"
import Button from "@mui/material/Button"
import DialogMui from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import DialogTransition from "components/DialogTransition"
import React from "react"

interface Props {
  open?: boolean
  maxWidth?: DialogProps["maxWidth"]
  onClose?: () => void
  title?: string
  actions: ({
    show?: boolean
    label?: string
    autoFocus?: boolean
    onClick?: () => void
  } & ButtonTypeMap["props"])[]
}

export default function Dialog({
  open,
  maxWidth,
  onClose,
  title,
  children,
  actions = []
}: React.PropsWithChildren<Props>) {
  return (
    <DialogMui
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      TransitionComponent={DialogTransition}>
      <DialogTitle>
        {title || " "}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        {actions
          .filter((i) => i.show !== false)
          .map((i, num) => (
            <Button key={num} {...i} sx={{px: 2, py: 1}}>
              {i.label}
            </Button>
          ))}
      </DialogActions>
    </DialogMui>
  )
}
