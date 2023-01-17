import React, {useEffect} from "react"
import {Helmet} from "react-helmet-async"
import {Box, Card, CardContent, Container, Grid} from "@mui/material"
import useSettings from "hooks/useSettings"
import gtm from "lib/gtm"
import CustomBreadcrumbs, {
  CustomBreadcrumbsProps
} from "components/CustomBreadcrumbs"

interface Props {
  pageTitle?: string
  helmetTabTitle?: string
  breadcrumbs?: CustomBreadcrumbsProps["breadcrumbs"]
}

export default function CardWithBreadcrumbs({
  breadcrumbs,
  helmetTabTitle,
  pageTitle,
  children
}: React.PropsWithChildren<Props>) {
  const {settings} = useSettings()

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  return (
    <>
      <Helmet>
        <title>{helmetTabTitle}</title>
      </Helmet>
      <Box pt={3} pb={8} minHeight="100%">
        <Container maxWidth={settings.compact ? "xl" : false}>
          <CustomBreadcrumbs breadcrumbs={breadcrumbs} title={pageTitle}/>
          <Box mt={3}>
            <Card>
              <CardContent>
                {children}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  )
}
