import {Box} from "@mui/material"
import {makeStyles} from "@mui/styles"
import React, {useState} from "react"
import {Outlet} from "react-router-dom"
import Header from "components/Header"
import Footer from "components/Footer"
import Sidebar from "components/Sidebar"

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%"
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
  content: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "auto",
    WebkitOverflowScrolling: "touch"
  }
}))

export default function MainLayout({children}: React.PropsWithChildren<{}>) {
  const s = useStyles()

  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  return (
    <Box className={s.root}>
      <Header onSidebarMobileOpen={() => setShowMobileSidebar(true)} />
      <Sidebar
        onMobileClose={() => setShowMobileSidebar(false)}
        openMobile={showMobileSidebar}
      />
      <Box className={s.layout}>
        <Box className={s.content}>{children || <Outlet />}</Box>
      </Box>
      <Footer />
    </Box>
  )
}
