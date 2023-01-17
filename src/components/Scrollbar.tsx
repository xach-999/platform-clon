import {forwardRef} from "react"
import PerfectScrollbar, {
  ScrollBarProps as PerfectScrollbarProps
} from "react-perfect-scrollbar"
import {Box} from "@mui/material"

interface ScrollbarProps extends PerfectScrollbarProps {}

export default forwardRef<HTMLDivElement, ScrollbarProps>(function Scrollbar(
  props,
  ref
) {
  const {children, ...other} = props

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  if (isMobile) {
    return (
      <Box ref={ref} sx={{overflowX: "auto"}}>
        {children}
      </Box>
    )
  }

  return (
    <PerfectScrollbar
      // @ts-ignore
      ref={ref}
      {...other}
    >
      {children}
    </PerfectScrollbar>
  )
})
