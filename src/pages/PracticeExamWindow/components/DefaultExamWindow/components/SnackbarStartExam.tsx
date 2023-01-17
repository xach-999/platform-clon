import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import {
  Snackbar,
  IconButton,
  Typography,
  Button,
  Box,
  Tooltip
} from "@mui/material"
import MuiAlert from "@mui/lab/Alert"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

const useStyles = makeStyles((theme) => ({
  snackbarContainer: {
    background: theme.palette.white.main,
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 2)
  },
  snackbarHead: {
    display: "flex"
  },
  snackbarTitle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2)
  }
}))

export default function SnackbarStartExam({open, setOpenHint, handleClick}) {
  const styles = useStyles()

  return (
    <Snackbar open={open}>
      <MuiAlert
        elevation={3}
        variant="filled"
        action={false}
        icon={false}
        className={styles.snackbarContainer}>
        <Box className={styles.snackbarHead}>
          <Typography className={styles.snackbarTitle}>
            <b>Press start after login to admin panel</b>
          </Typography>
          <Tooltip
            title="Click here to see additional info about your session!"
            arrow>
            <IconButton
              aria-label="info"
              onClick={() => setOpenHint((toggle) => !toggle)}
              size="large">
              <InfoOutlinedIcon color="primary"/>
            </IconButton>
          </Tooltip>
        </Box>
        <Box className={styles.buttonContainer}>
          <Button
            onClick={() => handleClick()}
            variant="contained"
            color="primary">
            Start Exam
          </Button>
        </Box>
      </MuiAlert>
    </Snackbar>
  )
}
