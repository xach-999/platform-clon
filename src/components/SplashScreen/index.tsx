import {Box} from "@mui/material"
import "./SplashScreen.css"

export default function SlashScreen() {
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        left: 0,
        p: 3,
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 2000
      }}
    >
      <img className="icon-logo" alt="Register" src="/static/kp_logo.png" />
    </Box>
  )
}
