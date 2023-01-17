import {Helmet} from "react-helmet-async"
import {Box, Container, Grid} from "@mui/material"
import useSettings from "hooks/useSettings"
import CustomBreadcrumbs from "components/CustomBreadcrumbs"
import React from "react"
import useMainPageLink from "hooks/useMainPageLink"

export default function PrepareExam() {
  const {settings} = useSettings()

  const {mainPageLink} = useMainPageLink()

  return (
    <>
      <Helmet>
        <title> Prepare Exam | KP Platform</title>
      </Helmet>
      <Box bgcolor="background.default" minHeight="100%" py={8}>
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <CustomBreadcrumbs
              breadcrumbs={[
                {
                  text: "Dashboard",
                  path: mainPageLink
                },
                {
                  text: "My Results"
                }
              ]}
              title="Prepare Exam"
            />
          </Grid>
        </Container>
      </Box>
    </>
  )
}
