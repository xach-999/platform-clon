import {useEffect} from "react"
import {Helmet} from "react-helmet-async"
import {Box, Card, CardContent, Container, Typography} from "@mui/material"
import PasswordRecoveryAmplify from "./components/PasswordRecoveryAmplify"
import useAuth from "hooks/useAuth"
import gtm from "lib/gtm"
import Footer from "components/Footer"

export default function PasswordRecovery() {
  const {platform} = useAuth() as any

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  return (
    <>
      <Helmet>
        <title>Password Recovery | KP Platform</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100% - 51px)"
        }}
      >
        <Container maxWidth="sm" sx={{py: 10}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center"
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8
            }}
          />
          <Card>
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
                    Password Recovery
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Tell us your email so we can send you a reset link
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3
                }}
              >
                {platform === "Amplify" && <PasswordRecoveryAmplify />}
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
