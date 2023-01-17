import React, {useMemo} from "react"
import {Helmet} from "react-helmet-async"
import {Box, Container, Grid} from "@mui/material"
import ExamsResults from "./components/ExamsResults"
import useSettings from "hooks/useSettings"
import CustomBreadcrumbs from "components/CustomBreadcrumbs"
import {useLocation} from "react-router-dom"
import useMainPageLink from "hooks/useMainPageLink"

export default function MyResults() {
  const {settings} = useSettings()
  const location = useLocation()

  const {mainPageLink} = useMainPageLink()

  const isPracticeResultsPage = useMemo(() => {
    if (!location.pathname) return false
    return location?.pathname.includes("practice-results")
  }, [location])
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {isPracticeResultsPage ? "Practice Results" : "My Results"} | KP
          Platform
        </title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between">
            <CustomBreadcrumbs
              breadcrumbs={[
                {
                  text: "Dashboard",
                  path: mainPageLink
                },
                {
                  text: isPracticeResultsPage
                    ? "Practice Results"
                    : "My Results"
                }
              ]}
              title={isPracticeResultsPage
                  ? "My Practice Test Results"
                  : "My Results"}
            />
          </Grid>
          <Box sx={{mt: 3}}>
            <ExamsResults />
          </Box>
        </Container>
      </Box>
    </>
  )
}
