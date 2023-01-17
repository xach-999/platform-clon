import {Box, Grid, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(1)
  },
  titleOne: {
    color: theme.palette.white.main,
    marginTop: theme.spacing(2)
  },
  titleTwo: {
    color: theme.palette.white.main,
    fontWeight: 200,
    marginTop: theme.spacing(1)
  }
}))

export default function SidebarLogoName() {
  const s = useStyles()

  return (
    <Grid
      item
      style={{
        background: "linear-gradient(rgb(118 215 255), rgb(0, 41, 85))"
      }}
      xs={4}
      md={4}
      className={s.container}>
      <Box
        sx={{
          height: 60,
          display: "flex",
          justifyContent: "center",
          "& > img": {
            maxHeight: "100%",
            width: "auto"
          }
        }}>
        <img alt="KP Logo" src="/static/kp_logo_name.svg"/>
      </Box>
      <Box>
        <Typography className={s.titleOne} variant="h5" align="center">
          IT practice and certification exams
        </Typography>
      </Box>
      <Box>
        <Typography className={s.titleTwo} variant="subtitle1" align="center">
          Technology-driven Skills Validation for Future Careers. <br /> Get
          Real Credentials for Real Skills.
        </Typography>
      </Box>
    </Grid>
  )
}
