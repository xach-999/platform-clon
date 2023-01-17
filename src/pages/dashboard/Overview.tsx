import {Link as RouterLink} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography
} from "@mui/material"
import useSettings from "hooks/useSettings"
import ChevronRightIcon from "assets/icons/ChevronRight"

export default function Overview() {
  const {settings} = useSettings()

  return (
    <>
      <Helmet>
        <title> Overview | KP Platform</title>
      </Helmet>
      <Box bgcolor="background.default" minHeight="100%" py={8}>
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                Overview
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{mt: 1}}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/"
                  variant="subtitle2"
                >
                  Dashboard
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  Overview
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
