import {Box, Button, TableCell, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"
import CircularProgress from "components/CircularProgress"

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
    marginTop: theme.spacing(2)
  },
  moreDetailsBtn: {
    width: "70%",
    [theme.breakpoints.up("sm")]: {
      width: "auto"
    }
  }
}))

interface TableRowDesktopProps {
  exam: any
  onDetailsClick: (examId: string | number) => void
}

export default function TableRowDesktop({
  exam,
  onDetailsClick
}: TableRowDesktopProps) {
  const s = useStyles()

  const getExamScoreToDisplay = (score) => {
    if (!score) {
      return 0
    } else {
      return score
    }
  }

  return (
    <>
      <TableCell>
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
            <Typography color="textPrimary" variant="subtitle2">
              {exam?.name}
            </Typography>
            <Typography color="textSecondary" noWrap variant="body2">
              <Typography component="span" variant="subtitle2">
                Date:
              </Typography>{" "}
              <span className={s.date}>{exam?.date}</span>
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography color="textPrimary" variant="subtitle2">
          Passed
        </Typography>
        <Typography
          color={exam?.isPassed === "No" ? "error" : "success"}
          noWrap
          variant="body2"
        >
          {exam?.isPassed}
        </Typography>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Box sx={{mr: 2}}>
            <Typography align="right" color="textPrimary" variant="subtitle2">
              {getExamScoreToDisplay(exam?.score)}%
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Score
            </Typography>
          </Box>
          <CircularProgress value={getExamScoreToDisplay(exam?.score)} />
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Box sx={{mr: 2}}>
            <Button
              // href={`/my-results/exam-details/${1}`}
              onClick={() => onDetailsClick(exam?.id)}
              variant="contained"
              color="primary"
            >
              More details
            </Button>
          </Box>
        </Box>
      </TableCell>
    </>
  )
}
