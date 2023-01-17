import cn from "classnames"
import {useEffect, useMemo} from "react"
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom"
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  Paper,
  Typography
} from "@mui/material"
import useAuth from "hooks/useAuth"
import NavSection from "./components/NavSection"
import {makeStyles} from "@mui/styles"
import KpLogo from "components/KpLogo"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import {isRouteAllowed} from "utils/security"
import {useSelector} from "store"
import sections from "./sections"
import useMainPageLink from "hooks/useMainPageLink"

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    background: "linear-gradient(#2192C0,  #002955)",
    height: "100%",
    overflowY: "auto"
  },
  contactUsButton: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignContent: "center",
    color: theme.palette.white.main,
    borderColor: theme.palette.white.main,
    "&:hover": {
      borderColor: theme.palette.white.main,
      background: theme.palette.white.main,
      color: theme.palette.primary.main
    }
  },
  goBackButton: {
    color: theme.palette.white.main,
    borderColor: theme.palette.white.main,
    minWidth: "50%",
    "&:hover": {
      color: theme.palette.primary.main
    }
  },
  avatar: {
    alignItems: "center",
    display: "flex",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    background: theme.palette.white.main,
    padding: theme.spacing(2)
  }
}))

interface DashboardSidebarProps {
  onMobileClose: () => void
  openMobile: boolean
}

export default function Sidebar({
  onMobileClose,
  openMobile
}: DashboardSidebarProps) {
  const s = useStyles()

  const location = useLocation()
  const {cognitoUser} = useAuth()
  const auth = useAuth()
  const isAuthenticated = auth.isAuthenticated
  const navigate = useNavigate()

  const userGroups = useSelector((state) => state.userSlice.userGroups)
  const fakeGroup = useSelector((state) => state.userSlice.fakeGroup)
  const {currentSchool, allSchools} = useSelector(
    (state) => state.schoolSlice
  )

  const {isStudent, mainPageLink} = useMainPageLink()

  const [firstName, lastName] = useMemo(() => {
    return [
      cognitoUser?.attributes.given_name,
      cognitoUser?.attributes.family_name
    ]
  }, [cognitoUser])

  const currSchoolInfo = useMemo(() => {
    if (!currentSchool || !allSchools) return
    return allSchools.find((el) => el.id === currentSchool)
  }, [currentSchool, allSchools])

  const sectionsFiltered = useMemo(() => {
    const groupsList = fakeGroup?.length ? fakeGroup : userGroups

    return sections.map((section) => {
      const allowedItems = section.items.reduce((acc, item) => {
        if (isRouteAllowed(item.groups, groupsList)) acc.push(item)
        return acc
      }, [] as typeof section.items)

      return {
        ...section,
        items: allowedItems
      }
    })
  }, [userGroups, currentSchool, fakeGroup])

  const logoImageURL = useMemo(() => {
    // TODO: uncomment when we have real logos
    if (isStudent) return null /*user?.photoUrl*/
    return currSchoolInfo?.logo
  }, [isStudent, currSchoolInfo])

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose()
    }
  }, [location.pathname])

  const content = (
    <Box className={cn(s.root, "scrollbar-hidden")}>
      {isAuthenticated ? (
        <>
          <Hidden lgUp>
            <Box display="flex" justifyContent="center" p={2}>
              <RouterLink to={mainPageLink}>
                <KpLogo height="auto" width="250px" />
              </RouterLink>
            </Box>
          </Hidden>
          <Box p={2}>
            <Paper className={s.avatar}>
              <RouterLink to="/account">
                <Avatar
                  src={logoImageURL}
                  sx={{
                    cursor: "pointer",
                    height: 48,
                    width: 48
                  }}
                />
              </RouterLink>
              <Box ml={3} display="flex" flexDirection="column" width="100%">
                <Typography color="textSecondary" variant="body1">
                  Hello
                </Typography>
                <Typography color="textPrimary" variant="subtitle2">
                  {!isStudent && currSchoolInfo?.name
                    ? currSchoolInfo.name
                    : [firstName, lastName].filter((_) => _).join(" ")}
                </Typography>
              </Box>
            </Paper>
          </Box>
          <Divider/>
          <Box p={2}>
            {sectionsFiltered.map((section) =>
              section.items.length ? (
                <NavSection
                  key={section.title}
                  pathname={location.pathname}
                  sx={{
                    "& + &": {
                      mt: 3
                    }
                  }}
                  {...section}
                />
              ) : null
            )}
          </Box>
          <Divider />
          <Box p={2}>
            <Typography color="white.main" variant="subtitle2" align="center">
              Need Help?
            </Typography>
            <Button
              className={s.contactUsButton}
              href="mailto:support@knowledge-pillars.com"
              variant="outlined"
              startIcon={<MailOutlineIcon />}>
              Contact us
            </Button>
          </Box>
        </>
      ) : (
        <Box p={3} display="flex" justifyContent="center">
          <Button
            className={s.goBackButton}
            color="primary"
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            onClick={() => {
              navigate("/")
            }}>
            Back
          </Button>
        </Box>
      )}
    </Box>
  )

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 290,
              backgroundColor: "background.paper"
            }
          }}>
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          anchor="left"
          PaperProps={{
            sx: {
              backgroundColor: "palette.white",
              position: "absolute",
              height: "calc(100% - 112px)",
              top: "64px !important",
              width: 290
            }
          }}
          variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  )
}
