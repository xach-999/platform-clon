import {useEffect} from "react"
import {Link as RouterLink} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import {Box, Button, Container, Typography} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material"
import gtm from "lib/gtm"
import useMainPageLink from "hooks/useMainPageLink"

export default function NotFound() {
  const theme = useTheme()
  const mobileDevice = useMediaQuery(theme.breakpoints.down("md"))

  const {mainPageLink} = useMainPageLink()

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  return (
    <>
      <Helmet>
        <title>404 Not Found | KP Platform</title>
      </Helmet>
      <Box display="flex" alignItems="center" minHeight="100%" px={3} py="80px" sx={{
        backgroundColor: "background.paper"
      }}>
        <Container maxWidth="lg">
          <Typography align="center" color="textPrimary" variant={mobileDevice ? "h4" : "h1"}>
            404: The page you are looking for isn’t here
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            mt={0.5}
            variant="subtitle2">
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation.
          </Typography>
          <Box display="flex" justifyContent="center" mt={6}>
            <Button
              color="primary"
              component={RouterLink}
              to={mainPageLink}
              variant="contained">
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}
