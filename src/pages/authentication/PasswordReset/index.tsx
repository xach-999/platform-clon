import {useEffect} from "react"
import {Link as RouterLink} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import {
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Typography
} from "@mui/material"
import PasswordResetAmplify from "./components/PasswordResetAmplify"
import useAuth from "hooks/useAuth"
import gtm from "lib/gtm"
import Footer from "components/Footer"

export default function PasswordReset() {
  const {platform} = useAuth() as any

  useEffect(() => {
    gtm.push({event: "page_view"})
  }, [])

  return (
    <>
      <Helmet>
        <title>Password Reset | KP Platform</title>
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
          >
            {/* <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40
                }}
              />
            </RouterLink> */}
          </Box>
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
                    Password Reset
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Reset your account password using your code
                  </Typography>
                </div>
                {/* <Box
                  sx={{
                    height: 32,
                    "& > img": {
                      maxHeight: "100%",
                      width: "auto"
                    }
                  }}
                >
                  <img
                    alt="Auth platform"
                    src={platformIcons[platform]}
                  />
                </Box> */}
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3
                }}
              >
                {platform === "Amplify" && <PasswordResetAmplify />}
              </Box>
              {/* <Divider sx={{ my: 3 }} /> */}
              {platform === "Amplify" && (
                <Link
                  color="textSecondary"
                  component={RouterLink}
                  to="/authentication/password-recovery"
                  variant="body2"
                  sx={{mt: 2}}
                >
                  Did you not receive the code?
                </Link>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
