import {useEffect} from "react"
import NProgress from "nprogress"
import {Box} from "@mui/material"

export default function LoadingScreen() {
  useEffect(() => {
    NProgress.start()

    return (): void => {
      NProgress.done()
    }
  }, [])

  return <Box bgcolor="background.paper" minHeight="100%" />
}
