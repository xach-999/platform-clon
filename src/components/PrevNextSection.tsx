import React from "react"
import makeStyles from "@mui/styles/makeStyles"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    marginTop: theme.spacing(5)
  },
  prevButtonContainer: {
    alignItems: "flex-start",
    display: "flex"
  },
  nextButtonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}))

export default function PrevNextSection({
  handlePrev,
  handleNext,
  PrevText = "Previous",
  NextText = "Next",
  disabledPrev = false,
  disabledNext = false
}) {
  const {buttonsContainer, prevButtonContainer, nextButtonContainer} =
    useStyles()

  return (
    <Grid className={buttonsContainer} container>
      <Grid item xs={6} className={prevButtonContainer}>
        {handlePrev && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePrev}
            disabled={disabledPrev}
            size="large"
          >
            {PrevText}
          </Button>
        )}
      </Grid>
      <Grid item xs={6} className={nextButtonContainer}>
        {handleNext && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={disabledNext}
            size="large"
          >
            {NextText}
          </Button>
        )}
      </Grid>
    </Grid>
  )
}
