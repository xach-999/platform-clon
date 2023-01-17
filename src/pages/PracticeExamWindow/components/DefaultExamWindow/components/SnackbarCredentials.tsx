import React from "react"
import {makeStyles} from "@mui/styles"
import {Snackbar, Typography, Button, Box, Tooltip} from "@mui/material"
import {Alert} from "@mui/material"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import PermIdentityIcon from "@mui/icons-material/PermIdentity"

const useStyles = makeStyles((theme) => ({
  snackbarContainer: {
    background: theme.palette.white.main,
    color: theme.palette.text.primary,
    padding: theme.spacing(0.5, 0.5, 0.5, 1.5),
    border: "2px solid red"
  },
  detailsContainerParent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  detailsContainer: {
    marginTop: theme.spacing(2),
    width: "fit-content"
  },
  details: {
    width: "fit-content"
  },
  detailsItem: {
    display: "flex",
    padding: theme.spacing(0.5)
  },
  detailsIcon: {
    marginRight: theme.spacing(0.5)
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end"
  },
  snackbarCredRoot: {
    bottom: "60px"
  }
}))

interface Props {
  open: boolean
  handleClose: () => void
  username: string
  password: string
}

export default function SnackbarCredentials({
  open,
  handleClose,
  username,
  password
}: Props) {
  const s = useStyles()

  return (
    <Snackbar
      open={open}
      anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      className={s.snackbarCredRoot}>
      <Alert
        elevation={3}
        variant="filled"
        action={false}
        icon={false}
        className={s.snackbarContainer}>
        <Typography>
          <b>
            Please copy/paste to examination window the username & password:
          </b>
        </Typography>
        <Box className={s.detailsContainerParent}>
          <Box className={s.detailsContainer}>
            <Tooltip title="username" placement="left">
              <Box className={s.detailsItem}>
                <PermIdentityIcon className={s.detailsIcon}/>
                <Typography className={s.details}>
                  {username}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="password" placement="left">
              <Box className={s.detailsItem}>
                <LockOpenIcon className={s.detailsIcon}/>
                <Typography className={s.details}>
                  {password}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>
        <Box className={s.buttonContainer}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  )
}
