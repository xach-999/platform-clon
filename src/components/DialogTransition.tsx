import {Slide} from "@mui/material"
import {TransitionProps} from "@mui/material/transitions"
import React from "react"

export default React.forwardRef(function DialogTransition(
  props: TransitionProps & {children: React.ReactElement<any, any>},
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props}/>
})
