import {Box} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useMemo, useState} from "react"
import cn from "classnames"
import {Outlet, useParams} from "react-router-dom"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import Footer from "components/Footer"

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper
  },
  layout: {
    position: "relative",
    width: "100%",
    height: "100%",
    paddingTop: "64px",
    paddingBottom: "48px",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "290px"
    }
  },
  contentOnly: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  content: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "auto",
    WebkitOverflowScrolling: "touch"
  }
}))

export default function DashboardLayout() {
  const s = useStyles()

  const params = useParams()

  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const checkExamWindowPage = useMemo(() => {
    return !!(params.examCode && params.sessionId && params.taskId)
  }, [params])

  return (
    <Box className={s.root}>
      {!checkExamWindowPage && (
        <Header onSidebarMobileOpen={() => setShowMobileSidebar(true)} />
      )}
      {!checkExamWindowPage && (
        <Sidebar
          onMobileClose={() => setShowMobileSidebar(false)}
          openMobile={showMobileSidebar}
        />
      )}
      <Box className={cn(s.layout, {[s.contentOnly]: checkExamWindowPage})}>
        <Box className={s.content}>
          <Outlet />
        </Box>
      </Box>
      {!checkExamWindowPage && <Footer />}
    </Box>
  )
}
