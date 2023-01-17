import {useEffect, useMemo} from "react"
import {useLocation, useRoutes} from "react-router-dom"
import {SnackbarProvider} from "notistack"
import {ThemeProvider, StyledEngineProvider} from "@mui/material/styles"
import "./i18n"
import GlobalStyles from "components/GlobalStyles"
import RTL from "components/RTL"
import SplashScreen from "components/SplashScreen"
import {gtmConfig} from "config"
import useAuth from "hooks/useAuth"
import useScrollReset from "hooks/useScrollReset"
import useSettings from "hooks/useSettings"
import gtm from "lib/gtm"
import {createTheme} from "theme"
import PracticeNotify from "components/PracticeNotify"
import {useDispatch, useSelector} from "store"
import {
  fetchUserDetailsThunk,
  getUserInfoThunk,
  setFakeGroup
} from "store/slices/userSlice/userSlice"
import getAllowedRoutes from "./routes"
import {
  fetchAvailableSchoolsThunk,
  setCurrentSchool
} from "store/slices/schoolSlice/schoolSlice"
import {Group} from "types/access"
import {ApolloProvider} from "@apollo/client"
import client from "./api/apollo"

export default function App() {
  const {settings} = useSettings()

  const auth = useAuth()
  const isAuthenticated = auth.isAuthenticated

  useScrollReset()

  const dispatch = useDispatch()
  const location = useLocation()

  const userRoles = useSelector((store) => store.userSlice.userGroups)
  const fakeGroups = useSelector((store) => store.userSlice.fakeGroup)
  const allSchools = useSelector((store) => store.schoolSlice.allSchools)
  const currentSchool = useSelector((store) => store.schoolSlice.currentSchool)

  const currentView = useRoutes(getAllowedRoutes(fakeGroups?.length ? fakeGroups : userRoles))

  const isGroupsLoading = useMemo(() => {
    return location.pathname.includes("authentication") || location.pathname === "/"
  }, [location])

  useEffect(() => {
    if (gtmConfig.containerId) {
      gtm.initialize(gtmConfig)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    dispatch(fetchUserDetailsThunk())
    dispatch(getUserInfoThunk())
    dispatch(fetchAvailableSchoolsThunk())
  }, [isAuthenticated])

  useEffect(() => {
    if (currentSchool) return

    const selectedAccount = localStorage.getItem("selectedAccount")

    if (selectedAccount) {
      const isUserAcc = selectedAccount === "student"
      dispatch(setFakeGroup(isUserAcc ? Group.Student : null))
      dispatch(setCurrentSchool(selectedAccount))
      return
    }

    if (!allSchools?.length) return

    const schoolToSet = allSchools[0]
    dispatch(setCurrentSchool(schoolToSet?.id || schoolToSet))
  }, [allSchools])

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme
  })

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          {!isGroupsLoading && !userRoles && <SplashScreen/>}
          <RTL direction={settings.direction}>
            <SnackbarProvider dense maxSnack={3}>
              <GlobalStyles/>
              {auth.isInitialized ? currentView : <SplashScreen/>}
              <PracticeNotify/>
            </SnackbarProvider>
          </RTL>
        </ApolloProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
