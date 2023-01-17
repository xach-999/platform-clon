import {Box, Grid, Link, Typography} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useNavigate} from "react-router-dom"
import {Link as RouterLink} from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: "100%",
    height: 48,
    bottom: 0,
    left: 0,
    padding: theme.spacing(0, 2),
    display: "flex",
    alignItems: "center",
    boxShadow: "0 -1px 10px 0px rgb(0 0 0 / 10%)",
    background: theme.palette.white.main,
    overflow: "hidden"
  },
  logoBox: {
    height: 35,
    "& > img": {
      maxHeight: "100%",
      width: "auto"
    },
    "&:hover": {
      cursor: "pointer"
    }
  },
  footerLeft: {
    display: "flex"
  },
  kpName: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: theme.spacing(1.5)
  },
  linksContainer: {
    display: "flex",
    justifyContent: "space-evenly"
  },
  footerLink: {},
  link: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textDecoration: "none",
    fontFamily: "Roboto",
    fontSize: "15px",
    color: theme.palette.text.secondary,
    "&:hover": {
      textDecoration: "none",
      color: theme.palette.primary.main
    }
  }
}))

export default function Footer() {
  const s = useStyles()
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const navigate = useNavigate()

  const copyrightText = `Copyright ${new Date().getFullYear()} © Knowledge Pillars`

  return (
    <Box className={s.root}>
      <Grid container>
        <Grid item xs={2} md={4} className={s.footerLeft}>
          <Box
            className={s.logoBox}
            onClick={() => navigate("/")}>
            <img alt="Register" src="/static/kp_logo.png"/>
          </Box>
          {!isMobile && (
            <Box className={s.kpName}>
              <Typography color="textSecondary" variant="subtitle2">
                {copyrightText}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={10} md={8} className={s.linksContainer}>
          <Link
            to="/terms-and-conditions"
            component={RouterLink}
            className={s.link}>
            Terms of use
          </Link>
          <Link to="/privacy-policy" component={RouterLink} className={s.link}>
            Privacy Policy
          </Link>
          <Link to="/faqs" component={RouterLink} className={s.link}>
            FAQs
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}
