import {makeStyles} from "@mui/styles"
import cn from "classnames"
import useAuth from "hooks/useAuth"
import {Link as RouterLink} from "react-router-dom"
import {Box, Hidden, IconButton, Toolbar, useTheme} from "@mui/material"
import type {AppBarProps} from "@mui/material"
import MenuIcon from "assets/icons/Menu"
import AccountPopover from "components/AccountPopover"
import KpLogo from "components/KpLogo"
import useMainPageLink from "hooks/useMainPageLink"

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0
  },
  rootLight: {
    backgroundColor: theme.palette.white.main,
    boxShadow: "0 1px 7px rgba(57, 63, 72, 0.2)",
    color: theme.palette.primary.contrastText
  },
  rootDark: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

interface Props extends AppBarProps {
  onSidebarMobileOpen?: () => void
}

export default function Header({onSidebarMobileOpen}: Props) {
  const s = useStyles()
  const theme = useTheme()

  const {mainPageLink} = useMainPageLink()

  const {isAuthenticated} = useAuth()

  return (
    <Box className={cn(s.root, theme.palette.mode === "light" ? s.rootLight : s.rootDark)}>
      <Toolbar sx={{height: 64, minHeight: 64}}>
        <Hidden lgUp>
          <IconButton
            color="primary"
            onClick={onSidebarMobileOpen}
            size="large">
            <MenuIcon fontSize="small"/>
          </IconButton>
        </Hidden>
        <Hidden lgDown>
          <RouterLink to={mainPageLink}>
            <KpLogo height="auto" width="250px"/>
          </RouterLink>
        </Hidden>
        {isAuthenticated && (
          <>
            <Box flexGrow={1} ml={2}/>
            <Box ml={2}>
              <AccountPopover/>
            </Box>
          </>
        )}
      </Toolbar>
    </Box>
  )
}
