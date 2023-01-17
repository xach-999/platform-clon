import {Box, Button, TableCell, Typography, Grid} from "@mui/material"
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles((theme) => ({
  date: {
    color: theme.palette.secondary.main
  },
  examInfoContainer: {
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center"
  },
  statusesContainer: {
    marginTop: theme.spacing(2)
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    maxHeight: "41px"
  },
  moreDetailsBtn: {
    width: "70%",
    [theme.breakpoints.up("sm")]: {
      width: "auto"
    }
  }
}))

interface TableRowMobileProps {
  exam: any
  onDetailsClick: (examId: string | number) => void
}

export default function TableRowMobile({
  exam,
  onDetailsClick
}: TableRowMobileProps) {
  const classes = useStyles()

  const getExamScoreToDisplay = (score) => {
    if (!score) {
      return 0
    } else {
      return score
    }
  }

  return (
    <TableCell>
      <Grid container>
        <Grid item xs={12} className={classes.examInfoContainer}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              "& > img": {
                flexShrink: 0,
                height: 85,
                width: 85
              }
            }}
          >
            <img alt="Exam logo" src={exam?.imgSrc} />
            <Box sx={{ml: 2}}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                align="center"
              >
                {exam?.name}
              </Typography>
              <Typography
                color="textSecondary"
                noWrap
                variant="body2"
                align="center"
              >
                <Typography component="span" variant="subtitle2" align="center">
                  Date:
                </Typography>{" "}
                <span className={classes.date}>{exam?.date}</span>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} sm={3} className={classes.statusesContainer}>
          <Typography color="textPrimary" align="center" variant="subtitle2">
            Passed
          </Typography>
          <Typography
            color={exam?.isPassed === "No" ? "error" : "success"}
            align="center"
            variant="body2"
          >
            {exam?.isPassed}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={3} className={classes.statusesContainer}>
          <Typography color="textPrimary" variant="subtitle2" align="center">
            {getExamScoreToDisplay(exam?.score)}%
          </Typography>
          <Typography color="textSecondary" variant="body2" align="center">
            Score
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3} className={classes.buttonContainer}>
          <Button
            // href={`/my-results/exam-details/${1}`}
            onClick={() => onDetailsClick(exam?.id)}
            variant="contained"
            color="primary"
            className={classes.moreDetailsBtn}
          >
            More details
          </Button>
        </Grid>
      </Grid>
    </TableCell>
  )
}
