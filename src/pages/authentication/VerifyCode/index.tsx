import {useEffect} from "react"
import {Link as RouterLink} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import {Box, Card, Grid, CardContent, Link, Typography} from "@mui/material"
import VerifyCodeAmplify from "./components/VerifyCodeAmplify"
import useAuth from "hooks/useAuth"
import gtm from "lib/gtm"
import {makeStyles} from "@mui/styles"
import {useTheme} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import SidebarLogoName from "components/SidebarLogoName"
import Footer from "components/Footer"

const useStyles = makeStyles((theme) => ({
  registerContainer: {
    height: "calc(100% - 51px)"
  },
  sidesContainer: {
    height: "calc(100% - 51px)"
  },
  rightSideContainer: {
    display: "flex",
    justifyContent: "center"
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
      width: "60%"
    },
    [theme.breakpoints.up("xl")]: {
      width: "40%"
    }
  },
  registerCard: {
    boxShadow: "none"
  },
  notReceiveCodeLink: {
    marginTop: theme.spacing(1)
  }
}))

export default function VerifyCode() {
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
        <title>Verify Code | KP Platform</title>
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
                      Verify Code
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Confirm registration using your verification code
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
                  {platform === "Amplify" && <VerifyCodeAmplify />}
                </Box>
                {platform === "Amplify" && (
                  <Link
                    className={classes.notReceiveCodeLink}
                    color="textSecondary"
                    component={RouterLink}
                    to="/authentication/password-recovery"
                    variant="body2"
                  >
                    Did you not receive the code?
                  </Link>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}
