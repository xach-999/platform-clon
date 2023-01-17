import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import {Backdrop, CircularProgress} from "@mui/material"

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}))

interface Props {
  open?: boolean
}

export default function BackdropLoad({open}: Props) {
  const s = useStyles()

  return (
    <Backdrop className={s.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
