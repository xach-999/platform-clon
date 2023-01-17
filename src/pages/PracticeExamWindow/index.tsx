import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import FlagIcon from "@mui/icons-material/Flag"
import Box from "@mui/material/Box"
import makeStyles from "@mui/styles/makeStyles"
import Dialog from "components/Dialog"
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from "react"
import DefaultExamWindow from "./components/DefaultExamWindow"
import {useDispatch} from "react-redux"
import {useParams, useNavigate} from "react-router-dom"
import {
  Typography,
  CircularProgress,
  Backdrop,
  Grid,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material"
import {useSelector} from "store"
import {finishSessionExam} from "store/slices/practiceSession/practiceSession"
import {selectTaskDetails} from "store/selectors"
import {FullScreen, useFullScreenHandle} from "react-full-screen"
import {
  TaskHeader,
  PopUpResetCode
} from "@knowledge-pillars-education-inc/kp-fe-lib"

const useStyles = makeStyles(() => ({
  meaningContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    columnGap: "15px",
    marginBottom: "8px"
  },
  tableContainer: {
    marginBottom: "24px"
  },
  markContainer: {
    display: "flex",
    alignItems: "center"
  }
}))

const useExamsSessionWindowStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    position: "absolute",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    top: 0,
    left: 0,
    width: "100%"
  },
  scoreCard: {
    margin: "0 auto"
  },
  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    background: "#ffff",
    color: theme.palette.text.primary,
    display: "flex",
    flexDirection: "column"
  },
  progressBar: {
    marginTop: theme.spacing(4)
  },

  //Styles applied after refactoring

  //globally used
  modalContent: {
    padding: theme.spacing(3, 0)
  },
  modalTitleContainer: {
    paddingBottom: 0,
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr"
  },
  modalTitle: {
    fontWeight: "bold"
  },
  DividerContainer: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  DividerBar: {
    height: "2px",
    margin: "auto",
    width: "40%",
    backgroundColor: theme.palette.kpYellowColors.main
  },

  // SphereEngineExam.js
  sphereEngineWorkSpace: {
    minHeight: "80vh",
    [theme.breakpoints.up("xl")]: {
      height: "85vh"
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  sphereEngineFooter: {
    display: "flex",
    flexDirection: "column",
    height: "20vh",
    [theme.breakpoints.up("xl")]: {
      height: "15vh"
    }
  },
  loadingMessage: {
    paddingLeft: "80px",
    paddingRight: "80px"
  },

  //WordpressExam.js
  wpWorkSpace: {
    minHeight: "70vh",
    [theme.breakpoints.up("xl")]: {
      minHeight: "75vh"
      // height: "100vh"
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  wpWorkSpaceFullHeight: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  wpFooter: {
    height: "30vh",
    [theme.breakpoints.up("xl")]: {
      height: "25vh"
    },
    display: "flex",
    flexDirection: "column"
  },
  loadingBarContainer: {
    minHeight: "4px",
    background: theme.palette.grey[200]
  },

  //ExainationWindow.js
  noCodeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: "50%"
  },
  noCodeContainerMsg: {
    padding: theme.spacing(8, 4)
  },
  noCodeButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing(3)
  },
  fullscreenIconWrapper: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
    backgroundColor: "black",
    height: "4vh"
  },
  fullscreenWrapper: {
    // backgroundColor: "white",
    overflowY: "auto"
  },
  fullscreenIcon: {
    margin: "5px 15px 5px 5px",
    "& svg": {
      color: "white",
      fill: "white"
    },
    cursor: "pointer"
  }
}))

export default function PracticeExamWindow() {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const s = useStyles()
  const examWindowStyles = useExamsSessionWindowStyles()

  const childRef = useRef(null)

  const [popupType, setType] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [timer, setTimer] = useState(1000)
  const [codeEditorData, setCodeEditorData] = useState("")

  const fullScreenHandle = useFullScreenHandle()

  const {loading, sessionTasksStatus} =
    useSelector((state) => state.practiceSession) || {}

  const {examName, userName, tasks, expirationDate, options} =
    useSelector((state) => state.practiceSession?.currentSession) || {}

  const {correctAnswer, validated, task} =
    useSelector((state) => state.practiceSession?.currentTask) || {}
  const question = useSelector(selectTaskDetails)

  const nextTaskId = useMemo(() => {
    if (!tasks) return null
    const currentTaskIndex = tasks.findIndex((el) => el.id === params.taskId)
    return tasks[currentTaskIndex + 1]?.id || null
  }, [tasks, params])

  const modalTitle = useMemo(() => {
    switch (popupType) {
      case "finishExamFirst":
      case "finishExamEnd":
        return "Finish exam"
      case "finishedExam":
        return "Exam finished"
      case "examReminder":
        return "Reminder"
      case "tasks":
        return "Review All Tasks"
      case "notSubmittedTask":
        return "Action required"
      case "correctAnswer":
        return "Result"
      default:
        return null
    }
  }, [popupType])

  const checkAllPassedQuestions = useMemo(() => {
    return (
      sessionTasksStatus &&
      !sessionTasksStatus?.find((task) => !task.flag && !task.answered)
    )
  }, [sessionTasksStatus])

  useEffect(() => {
    if (timer < 300001 && timer > 299000) {
      setType("examReminder")
    }
    if (timer < 100) {
      setType("finishedExam")
    }
  }, [timer])

  useEffect(() => {
    if (fullScreenHandle.active && !isFullScreen) return setIsFullScreen(true)
    if (!fullScreenHandle.active && isFullScreen) return setIsFullScreen(false)
  }, [fullScreenHandle, task?.type])

  // useEffect(() => {
  //   if(localStorage.getItem("instructionsOpen") && examCode !== "wordpress"){
  //     setInstructionsOpen(true)
  //     localStorage.removeItem("instructionsOpen")
  //   }
  // }, [examCode])

  const handleClose = async (closeType) => {
    if (closeType === "confirm") {
      await dispatch(finishSessionExam(params?.sessionId))
      if (options?.showResult === "end") {
        navigate(`/practice-answers/${params?.sessionId}`, {replace: true})
        return
      }
      navigate(`/practice-results/exam-details/${params?.sessionId}`, {
        replace: true
      })
      return
    }
    if (closeType === "continue") {
      setType(null)
      return
    }
    if (closeType === "review-tasks") {
      setType("tasks")
      return
    }
    if (closeType === "exit") {
      navigate("/")
      return
    }
    if (closeType === "close") {
      setType("")
      return
    }
    if (closeType === "nextTask") {
      childRef?.current?.nextTask()
    }
    if (closeType === "repeatQuestion") {
      handleClickOptions("repeatQuestion")
    }
  }

  const onFullButtonClick = () => {
    if (fullScreenHandle.active) {
      setIsFullScreen(false)
      return fullScreenHandle.exit().catch(console.warn)
    }
    setIsFullScreen(true)
    fullScreenHandle.enter().catch(console.warn)
  }

  const handleClickOptions = (optionType: string): void => {
    switch (optionType) {
      case "repeatQuestion":
        childRef.current.repeatQuestion()
        setType(null)
        break
      default:
        break
    }
  }

  // const setInstructions = () => {
  //   setInstructionsOpen(!instructionsOpen)
  // }

  const refreshCode = useCallback(() => {
    setCodeEditorData(question?.practicalDetails?.template)
  }, [question])

  const handleClick = useCallback(taskId => {
    const {examCode, sessionId} = params

    navigate(`/exam-window/${examCode}/${sessionId}/${taskId}`, {
      replace: true
    })

    setType(null)
  }, [dispatch])

  return (
    <FullScreen
      handle={fullScreenHandle}
      className={examWindowStyles.fullscreenWrapper}>
      <TaskHeader
        studentName={userName}
        sessionId={params?.sessionId}
        examName={examName}
        deadline={expirationDate}
        setTimer={setTimer}
        checkAllPassedQuestions={checkAllPassedQuestions}
        loading={loading}
        setType={setType}
        logo="/static/kp_logo.png"
      />
      <DefaultExamWindow
        ref={childRef}
        setPopupType={setType}
        isFullScreen={isFullScreen}
        onFullButtonClick={onFullButtonClick}
        codeEditorData={codeEditorData}
        setCodeEditorData={setCodeEditorData}
        onRefresh={refreshCode}
      />
      <Dialog
        open={popupType === "tasks"}
        title={modalTitle}
        onClose={() => handleClose("close")}
        actions={[{
          label: "Finish exam",
          color: "error",
          onClick: () => handleClose("confirm")
        }]}>
        <Box sx={{width: "auto", pt: 1}}>
          <Typography variant="subtitle2" align="center">
            Please select the task you want to review
          </Typography>
          <Grid className={s.meaningContainer}>
            <Box className={s.markContainer}>
              <Typography variant="subtitle2">Not Answered</Typography>
              <CheckBoxIcon fontSize="small" color="action"/>
            </Box>
            <Box className={s.markContainer}>
              <Typography variant="subtitle2">Flagged</Typography>
              <FlagIcon fontSize="small" color="error"/>
            </Box>
            <Box className={s.markContainer}>
              <Typography variant="subtitle2">Answered</Typography>
              <CheckBoxIcon fontSize="small" color="success"/>
            </Box>
          </Grid>
          <TableContainer component={Paper} className={s.tableContainer}>
            <Table aria-label="caption-table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{minWidth: 85, fontSize: 20}}>#</TableCell>
                  <TableCell align="left">Tasks</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(sessionTasksStatus || []).map((row, num) => (
                  <TableRow key={`${row.taskId}-${num}`}>
                    <TableCell scope="row">Task {num + 1}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="center">
                      {row.flag ? (
                        <FlagIcon fontSize="small" color="error"/>
                      ) : row.answered ? (
                        <CheckBoxIcon fontSize="small" color="success"/>
                      ) : (
                        <CheckBoxIcon fontSize="small" color="action"/>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        sx={{p: "2px 7px", minWidth: "initial"}}
                        onClick={() => handleClick(row.taskId)}>
                        <ArrowRightAltIcon fontSize="medium"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
      {popupType === "refreshCode" && (
        <PopUpResetCode handleClose={handleClose} refreshCode={refreshCode}/>
      )}
      <Dialog
        open={popupType === "finishExamFirst"}
        title={modalTitle}
        actions={[{
          label: "No, return to exam",
          color: "error",
          onClick: () => handleClose("continue")
        }, {
          label: "Yes, review tasks",
          color: "success",
          onClick: () => handleClose("review-tasks")
        }]}>
        <Box sx={{width: "auto", pt: 1}}>
          <Typography variant="subtitle2" align="center">
            Are you sure you want to finish the exam ? If yes, you will be able
            to review all your exam tasks.
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={popupType === "finishExamEnd"}
        title={modalTitle}
        actions={[{
          label: "No, review tasks again",
          color: "error",
          onClick: () => handleClose("review-tasks")
        }, {
          label: "Yes, finish exam and exit",
          color: "success",
          onClick: () => handleClose("confirm")
        }]}>
        <Box width="26vw" pt={1}>
          <Typography variant="subtitle2" align="center">
            Are you sure you want to finish the exam now? This is the last
            chance to review the tasks one last time. If instead you click YES,
            your test will be scored and the exam will be completed.
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={popupType === "finishedExam"}
        title={modalTitle}
        actions={[{
          label: "Close",
          color: "error",
          onClick: () => handleClose("confirm")
        }]}>
        <Box width="26vw" pt={1}>
          <Typography variant="subtitle1" align="center">
            The time allocated for the exam is now over. Thank you for taking
            the exam with us.
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={popupType === "examReminder"}
        title={modalTitle}
        actions={[{
          label: "OK",
          color: "error",
          onClick: () => handleClose("close")
        }]}>
        <Box width="26vw" pt={1}>
          <Typography variant="subtitle1" align="center">
            You have 5 minute left
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={popupType === "notSubmittedTask"}
        title={modalTitle}
        actions={[{
          label: "Continue",
          color: "primary",
          onClick: () => handleClose("close")
        }]}>
        <Box width="26vw" pt={1}>
          <Typography variant="subtitle1" align="center">
            Please click the Run button before the final submission!
          </Typography>
        </Box>
      </Dialog>
      <Dialog
        open={popupType === "correctAnswer"}
        title={modalTitle}
        actions={[{
          label: "Try again",
          color: "secondary",
          onClick: () => handleClose("repeatQuestion")
        }, {
          label: nextTaskId ? "Next Task" : "Review all questions",
          color: "primary",
          onClick: () => handleClose("nextTask")
        }]}>
        <Box sx={{width: "30vw", pt: 1}}>
          <Typography
            variant="h6"
            align="center"
            color={validated ? "green" : "error"}>
            {validated ? "Correct Answer" : "Incorrect Answer"}
          </Typography>
          <Grid container direction="column" sx={{minWidth: "300px"}}>
            {!validated && correctAnswer && (
              <Grid item>
                <Typography variant="subtitle2">
                  Correct answer is:
                </Typography>
              </Grid>
            )}
            <Grid item>
              <Box width="100%">
                {correctAnswer &&
                  correctAnswer
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((line) => (
                      <Box
                        key={line.id}
                        display="flex"
                        alignItems="center"
                        mb="10px"
                        p="5px"
                        border="1px solid #ddd"
                        borderRadius="4px">
                        <Box flexBasis="50%">
                          {line.text}
                        </Box>
                      </Box>
                    ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      {popupType === "scored" && (
        <Backdrop className={examWindowStyles.backdrop} open>
          <Typography
            className={examWindowStyles.loadingMessage}
            variant="h6"
            align="center">
            Thank you for taking the exam. We will contact you in the next
            24-48h with your results. <br/>
            <b>
              We are saving your exam information. <br/> Please do not close or
              leave this tab and we will redirect you to the main page in about
              1 minute.
            </b>
          </Typography>
          <CircularProgress
            className={examWindowStyles.progressBar}
            color="inherit"
          />
        </Backdrop>
      )}
    </FullScreen>
  )
}
