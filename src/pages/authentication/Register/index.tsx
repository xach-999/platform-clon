import {useEffect} from "react"
import {Link as RouterLink} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import {Box, Card, CardContent, Grid, Link, Typography} from "@mui/material"
import RegisterAmplify from "./components/RegisterAmplify"
import SidebarLogoName from "components/SidebarLogoName"
import gtm from "lib/gtm"
import {makeStyles} from "@mui/styles"
import {useTheme} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Footer from "components/Footer"

const useStyles = makeStyles((theme) => ({
  registerContainer: {
    height: "auto"
  },
  sidesContainer: {
    height: "auto"
  },
  rightSideContainer: {
    display: "flex",
    justifyContent: "center",
    minHeight: "calc(100vh - 51px)"
  },
  registerCardContainer: {
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
      width: "90%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "70%"
    }
  },
  registerCard: {
    boxShadow: "none"
  },
  haveAccount: {
    marginTop: theme.spacing(1)
  }
}))

export default function Register() {
  const classes = useStyles()

  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  return (
    <>
      <Helmet>
        <title>Register | KP Platform</title>
      </Helmet>
      <Grid container className={classes.sidesContainer}>
        {!isMobile && <SidebarLogoName />}
        <Grid
          item
          xs={isMobile ? 12 : 8}
          md={8}
          className={classes.rightSideContainer}
        >
          <Box className={classes.registerCardContainer}>
            <Card className={classes.registerCard}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 4
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3
                  }}
                >
                  <div>
                    <Typography color="textPrimary" gutterBottom variant="h4">
                      Register
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Register on the internal platform
                    </Typography>
                  </div>
                  <Box
                    sx={{
                      height: 50,
                      "& > img": {
                        maxHeight: "100%",
                        width: "auto"
                      }
                    }}
                  >
                    <img alt="Register" src="/static/kp_logo.png" />
                  </Box>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    mt: 3
                  }}
                >
                  <RegisterAmplify />
                </Box>
                <Link
                  className={classes.haveAccount}
                  color="textSecondary"
                  component={RouterLink}
                  to="/authentication/login"
                  variant="body2"
                >
                  Back to Login
                </Link>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}
