import React from "react"
import {Helmet} from "react-helmet-async"
import {Box, Container, Grid} from "@mui/material"
import useSettings from "hooks/useSettings"
import CustomBreadcrumbs from "components/CustomBreadcrumbs"
import useMainPageLink from "hooks/useMainPageLink"

export default function RedeemKey() {
  const {settings} = useSettings()

  const {mainPageLink} = useMainPageLink()

  return (
    <>
      <Helmet>
        <title> Redeem Voucher Key | KP Platform</title>
      </Helmet>
      <Box bgcolor="background.default" minHeight="100%" py={3}>
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between">
            <CustomBreadcrumbs
              breadcrumbs={[
                {
                  text: "Dashboard",
                  path: mainPageLink
                },
                {
                  text: "Redeem Voucher Key"
                }
              ]}
              title="Redeem Voucher Key"
            />
          </Grid>
        </Container>
      </Box>
    </>
  )
}
