import {format} from "date-fns"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  List,
  Paper,
  ListItem,
  Typography
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import CircularProgress from "components/CircularProgress"
import fromAbbrToWords from "consts/fromAbbrToWords"
import {NewSessionBodySelect} from "store/slices/practiceSession/practiceSession.t"

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    padding: theme.spacing(2)
  },
  cardHeader: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column"
    }
  },
  examTitle: {
    alignSelf: "flex-start",
    marginLeft: theme.spacing(3)
  },
  logo: {
    width: "180px",
    height: "auto"
  },
  candidateInfo: {
    display: "flex",
    marginTop: theme.spacing(3)
  },
  name: {
    padding: theme.spacing(3)
  },
  id: {
    padding: theme.spacing(3)
  },
  examListInfo: {
    width: "60%",
    [theme.breakpoints.down("md")]: {
      width: "100%"
    }
  },
  examBarContainer: {
    width: "40%",
    display: "flex",
    justifyContent: "center",
    marginLeft: theme.spacing(9),
    background: theme.palette.background.paper,
    [theme.breakpoints.down("lg")]: {
      marginLeft: theme.spacing(3),
      padding: theme.spacing(2)
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "auto"
    }
  },
  examBarBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  examInfoContent: {
    display: "flex",
    padding: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      padding: 0
    }
  }
}))

interface Props {
  examCode: string
  displayCode: string
  examScore: string
  examStatus: string
  candidateName: string
  finishDate: string
  examName: string
  showAnswers?: NewSessionBodySelect
  isPractice?: boolean
  status: string
  accredibleCredentialId: string
}

export default function ExamDetailsInfo({
  examCode = "Unknown",
  displayCode = "",
  examScore = null,
  examStatus = null,
  candidateName = "Unknown",
  finishDate = null,
  examName = "Unknown",
  showAnswers,
  isPractice = false,
  status,
  accredibleCredentialId = null
}: Props) {
  const s = useStyles()

  return (
    <Box bgcolor="background.default" minHeight="100%">
      <Card className={s.cardContainer}>
        <CardHeader
          avatar={
            <Avatar
              variant="rounded"
              className={s.logo}
              src={`/${isPractice ? "practiceDetailsIcons" : "examIcons"}/${examCode}.png`}
            />
          }
          disableTypography
          style={{paddingBottom: 0}}
          className={s.cardHeader}
          title={
            <Typography color="primary" variant="h4" className={s.examTitle}>
              {examName || fromAbbrToWords[examCode]} ({displayCode}){" "}
              {isPractice ? "- Practice Test" : ""}
            </Typography>
          }
          subheader={
            <Box className={s.candidateInfo}>
              <Link
                color="textSecondary"
                underline="none"
                variant="subtitle1"
                className={s.name}>
                Candidate: {candidateName}
              </Link>
            </Box>
          }
        />
        <CardContent className={s.examInfoContent}>
          <List className={s.examListInfo}>
            <ListItem
              disableGutters
              divider
              sx={{
                justifyContent: "space-between",
                padding: 2
              }}>
              <Typography color="textPrimary" variant="subtitle2">
                Exam Code
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {examCode}
              </Typography>
            </ListItem>
            <ListItem
              disableGutters
              divider
              sx={{
                justifyContent: "space-between",
                padding: 2
              }}>
              <Typography color="textPrimary" variant="subtitle2">
                Score
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {`${examScore ?? "Unknown"} ${examScore ? "%" : ""}`}
              </Typography>
            </ListItem>
            <ListItem
              disableGutters
              divider
              sx={{
                justifyContent: "space-between",
                padding: 2
              }}>
              <Typography color="textPrimary" variant="subtitle2">
                Status
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {status === "in-progress"
                  ? status
                  : examStatus === null || examStatus === undefined
                  ? "Unknown"
                  : examStatus
                  ? "Passed"
                  : "Failed"
                }
              </Typography>
            </ListItem>
            <ListItem
              disableGutters
              divider
              sx={{
                justifyContent: "space-between",
                padding: 2
              }}>
              <Typography color="textPrimary" variant="subtitle2">
                Date
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {finishDate ? format(Date.parse(finishDate), "dd MMM yyyy") : "Unknown"}
              </Typography>
            </ListItem>
            {isPractice && (
              <ListItem
                disableGutters
                divider
                sx={{
                  justifyContent: "space-between",
                  padding: 2
                }}>
                <Typography color="textPrimary" variant="subtitle2">
                  Show Answers
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {showAnswers === "end" ? "end of test" : "task level"}
                </Typography>
              </ListItem>
            )}
            {accredibleCredentialId && (
              <ListItem
                disableGutters
                divider
                sx={{
                  justifyContent: "space-between",
                  padding: 2
                }}>
                <Typography color="textPrimary" variant="subtitle2">
                  Certificate
                </Typography>
                <Link
                  target="_blank"
                  href={`https://www.credential.net/${accredibleCredentialId}`}
                  underline="always"
                  variant="body2">
                  View
                </Link>
              </ListItem>
            )}
          </List>
          <Paper className={s.examBarContainer}>
            <Box className={s.examBarBox}>
              <CircularProgress
                value={Number.parseFloat(examScore) || 0}
                width={170}
                height={170}
                showPercentage={true}
              />
            </Box>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  )
}
