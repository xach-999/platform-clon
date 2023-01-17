import {useEffect} from "react"
import {Link as RouterLink} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import {Box, Card, CardContent, Link, Grid, Typography} from "@mui/material"
import LoginAmplify from "./components/LoginAmplify"
import SidebarLogoName from "components/SidebarLogoName"
import useAuth from "hooks/useAuth"
import gtm from "lib/gtm"
import {makeStyles} from "@mui/styles"
import {useTheme} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Footer from "components/Footer"

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    height: "auto"
  },
  sidesContainer: {
    minHeight: "calc(100vh - 51px)"
  },
  rightSideContainer: {
    display: "flex",
    justifyContent: "center"
  },
  loginCardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%"
    },
    [theme.breakpoints.up("sm")]: {
      width: "75%"
    },
    [theme.breakpoints.up("md")]: {
      width: "60%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "50%"
    }
  },
  loginCard: {
    boxShadow: "none"
  },
  linksContainer: {
    marginTop: theme.spacing(1)
  },
  createNewAccount: {
    float: "left"
  },
  forgotPassword: {
    float: "right"
  },
  titleOne: {
    color: theme.palette.white.main,
    marginTop: theme.spacing(2)
  },
  titleTwo: {
    color: theme.palette.white.main,
    fontWeight: 200,
    marginTop: theme.spacing(1)
  }
}))

export default function Login() {
  const {platform} = useAuth() as any
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  return (
    <>
      <Helmet>
        <title>Login | KP Platform</title>
      </Helmet>
      <Box className={classes.loginContainer}>
        <Grid container className={classes.sidesContainer}>
          {!isMobile && <SidebarLogoName/>}
          <Grid
            item
            xs={isMobile ? 12 : 8}
            md={8}
            className={classes.rightSideContainer}>
            <Box className={classes.loginCardContainer}>
              <Card className={classes.loginCard}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 4
                  }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box>
                      <Typography color="primary" gutterBottom variant="h2">
                        Log in
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Log in on the internal platform
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 50,
                        "& > img": {
                          maxHeight: "100%",
                          width: "auto"
                        }
                      }}>
                      <img alt="Auth platform" src="/static/kp_logo.png"/>
                    </Box>
                  </Box>
                  <Box flexGrow={1} mt={3}>
                    {platform === "Amplify" && <LoginAmplify/>}
                  </Box>
                  <Box className={classes.linksContainer}>
                    <Link
                      className={classes.createNewAccount}
                      color="textSecondary"
                      component={RouterLink}
                      to="/authentication/register"
                      variant="body2">
                      Create new account
                    </Link>
                    {platform === "Amplify" && (
                      <Link
                        className={classes.forgotPassword}
                        color="textSecondary"
                        component={RouterLink}
                        to="/authentication/password-recovery"
                        variant="body2">
                        Forgot password
                      </Link>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer/>
    </>
  )
}
