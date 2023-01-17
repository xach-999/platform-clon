import {useNavigate} from "react-router"
import {useParams} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import {selectTaskDetails} from "store/selectors"
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  memo
} from "react"
import {makeStyles} from "@mui/styles"
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  LinearProgress,
  Theme,
  Typography
} from "@mui/material"
import {DefaultExamWindowProps} from "pages/PracticeExamWindow/types.t"
import {
  addFlaggedTaskThunk,
  getTasksAnswers,
  getSessionTasksStatus,
  fetchSessionExamDetails,
  fetchTask,
  finishSessionExam,
  getSessionInstanceWPThunk,
  removeFlaggedTaskThunk,
  startSessionExam,
  submitPracticeTask
} from "store/slices/practiceSession/practiceSession"
import Description from "./components/Description"
import SnackbarCredentials from "./components/SnackbarCredentials"
import WorkSpace from "../WorkSpace"
import {
  TaskFooterFirstBar,
  TaskFooterSecondBar
} from "@knowledge-pillars-education-inc/kp-fe-lib"
import CustomPdfModal from "./components/CustomPdfModal"
import WordpressExamSpace from "./components/WordpressExamSpace"

const useStyles = makeStyles<
  Theme,
  {
    isWordpressExam: boolean
    isPractical: boolean
    isFullScreen: boolean
    isMultipleQuestion: boolean
  }
>((theme) => {
  return {
    sphereEngineWorkSpace: ({isWordpressExam, isMultipleQuestion}) => {
      let sphereHeight = "calc(100vh - 200px)"
      let marginBottom = "113px"
      let marginTop = "87px"

      if (isWordpressExam && !isMultipleQuestion) {
        marginBottom = "173px"
        sphereHeight = "calc(100vh - 260px)"
      }

      return {
        height: sphereHeight,
        marginBottom: marginBottom,
        marginTop: marginTop
      }
    },
    sphereEngineFooter: ({isWordpressExam, isMultipleQuestion}) => {
      let footerHeight = "113px"

      if (isWordpressExam && !isMultipleQuestion) {
        footerHeight = "173px"
      }

      return {
        height: footerHeight
      }
    },
    sphereEngineWorkSpaceBasic: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative"
    },
    sphereEngineFooterBasic: {
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      bottom: "0",
      width: "100%",
      background: "white",
      zIndex: 1,
      minWidth: "980px"
    },
    loadingBarContainer: {
      minHeight: "4px",
      background: theme.palette.grey[200]
    },
    customStyles: {
      height: "79vh",
      minHeight: "77vh"
    },
    pdfWrapper: {
      maxHeight: "100%",
      overflow: "auto"
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
    }
  }
})

const DefaultExamWindow = React.forwardRef(
  (
    {
      setPopupType,
      isFullScreen,
      onFullButtonClick,
      codeEditorData,
      setCodeEditorData,
      onRefresh
    }: DefaultExamWindowProps,
    ref
  ) => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [runDisabled, setRunDisabled] = useState(null)
    const [kpCodeAnswer, setKpCodeAnswer] = useState(null)
    const [answerConfirmed, setAnswerConfirmed] = useState(false)
    const [readyToBeFinished, setReadyToBeFinished] = useState(false)
    const [differentTypeAnswers, setDifferentTypeAnswers] = useState(null)
    const [openHint, setOpenHint] = useState(false)
    const [iframeWasLoaded, setIframeWasLoaded] = useState(false)
    const [openDoc, setOpenDoc] = useState(false)

    const {loading, sessionTasksStatus} = useSelector(
      (state) => state.practiceSession
    )
    const tasksAnswers = useSelector(
      (state) => state.practiceSession?.tasksAnswers
    )
    const showResult = useSelector(
      (state) => state.practiceSession.currentSession?.options?.showResult
    )
    const currentTask = useSelector(
      (state) => state.practiceSession.currentTask
    )
    const currentSession = useSelector(
      (state) => state.practiceSession.currentSession || {}
    )
    const question = useSelector(selectTaskDetails)

    const currentTaskType = currentTask?.task?.type
    const {
      examCode: sessionExamCode,
      instance: sessionInstance,
      expirationDate,
      tasks: sessionTasks
    } = currentSession

    const isWordpressExam = useMemo(() => {
      return sessionExamCode === "wordpress"
    }, [sessionExamCode])

    const isPractical = useMemo(() => {
      return currentTaskType === "practical"
    }, [currentTaskType])

    const nextTaskId = useMemo(() => {
      if (!sessionTasks) return null
      const currentTaskIndex = sessionTasks.findIndex(
        (el) => el.id === params.taskId
      )
      return sessionTasks[currentTaskIndex + 1]?.id || null
    }, [sessionTasks, params])

    const prevTaskId = useMemo(() => {
      if (!sessionTasks) return null
      const currentTaskIndex = sessionTasks.findIndex(
        (el) => el.id === params.taskId
      )
      return sessionTasks[currentTaskIndex - 1]?.id || null
    }, [sessionTasks, params])

    const currentTaskIndex = useMemo(() => {
      if (!sessionTasks) return null
      return sessionTasks.findIndex((el) => el.id === params.taskId)
    }, [sessionTasks, params])

    const {examCode, sessionId, taskId} = useMemo(
      () => params || {},
      [params]
    )

    // const nextBtnLabel = useMemo(() => {
    //   if (readyToBeFinished) return "Submit"
    //   return "Submit Task"
    // }, [readyToBeFinished])

    const isTaskFlagged = useMemo(() => {
      return sessionTasksStatus?.some((e) => e.taskId === taskId && e.flag)
    }, [sessionTasksStatus, taskId])

    const taskAnswer = useMemo(() => {
      return tasksAnswers?.find((task) => task.taskId === taskId)
    }, [tasksAnswers, taskId])

    useEffect(() => {
      if (question?.type === "practical") {
        if (taskAnswer?.sourceCode) {
          setCodeEditorData(taskAnswer?.sourceCode)
        } else {
          setCodeEditorData(question?.practicalDetails?.template)
        }
      }
    }, [taskAnswer, question])

    const {
      loadingBarContainer,
      sphereEngineFooter,
      sphereEngineWorkSpaceBasic,
      sphereEngineFooterBasic,
      sphereEngineWorkSpace,
      customStyles,
      pdfWrapper,
      progressBar,
      backdrop
    } = useStyles({
      isWordpressExam,
      isFullScreen,
      isPractical,
      isMultipleQuestion: currentTaskType === "multiple"
    })

    useEffect(() => {
      dispatch(fetchSessionExamDetails(sessionId))
      dispatch(getSessionTasksStatus(sessionId))
      dispatch(getTasksAnswers(sessionId))
    }, [sessionId])

    useEffect(() => {
      // reset local variables
      resetQuestionVariables()
    }, [taskId])

    useEffect(() => {
      if (!expirationDate) return

      const finishExamAndNavigate = async () => {
        await dispatch(finishSessionExam(params.sessionId))
        navigate(`/my-results/exam-details/${params.sessionId}`, {
          replace: true
        })
      }

      const timeLeft = Date.parse(expirationDate) - Date.now()
      if (timeLeft >= 0) return

      finishExamAndNavigate()
    }, [expirationDate, sessionId])

    useEffect(() => {
      if (
        currentSession?.id &&
        currentTask?.task?.id !== taskId &&
        (sessionInstance ? sessionInstance.status === "running" : true)
      ) {
        dispatch(fetchTask({sessionId, taskId}))
      }
    }, [currentSession?.id, taskId, sessionInstance?.status])

    useEffect(() => {
      let interval
      if (isWordpressExam && sessionInstance?.status !== "running") {
        interval = setInterval(() => {
          dispatch(getSessionInstanceWPThunk(sessionId))
        }, 5000)
      }

      if (sessionInstance?.status === "running") {
        clearInterval(interval)

        if (isWordpressExam && !currentSession.expirationDate) {
          instanceRunningHandler()
        }
      }
      return () => {
        clearInterval(interval)
      }
    }, [sessionInstance, sessionId, taskId])

    const wordPressSubmitTask = async () => {
      await dispatch(submitPracticeTask({taskId, sessionId}))
      await dispatch(getTasksAnswers(sessionId))
    }

    const submitTask = async (input?: string) => {
      const answer = input || kpCodeAnswer || ""
      const body = {}

      if (currentTaskType === "practical") {
        body["sourcecode"] = answer
      } else {
        body["answers"] = differentTypeAnswers || []
      }

      await dispatch(submitPracticeTask({taskId, sessionId, body}))
      await dispatch(getTasksAnswers(sessionId))
    }

    const NextTaskFunctionality = async () => {
      if (
        !isWordpressExam &&
        currentTaskType === "practical" &&
        !kpCodeAnswer
      ) {
        setPopupType("notSubmittedTask")
        return
      }
      const showByTask = showResult === "task"

      // next task functionality
      if (!answerConfirmed || !showByTask) {
        if (isWordpressExam && currentTaskType === "practical") {
          await wordPressSubmitTask()
        } else {
          await submitTask()
        }
        await dispatch(getSessionTasksStatus(sessionId))
      }

      if (!nextTaskId && showByTask) {
        setReadyToBeFinished(true)
        // setAnswerConfirmed(true)

        setPopupType("correctAnswer")
        return
      }
      if ((answerConfirmed && showByTask) || !showByTask) {
        onNextQuestion()
        return
      }
      setPopupType("correctAnswer")
      setAnswerConfirmed(true)
      // await dispatch(getSessionTasksStatus(sessionId))
      // await dispatch(getTasksAnswers(sessionId))
    }

    const handleFlagClickFooter = () => async () => {
      if (isTaskFlagged) {
        await dispatch(removeFlaggedTaskThunk({taskId, sessionId}))
      } else {
        await dispatch(addFlaggedTaskThunk({taskId, sessionId}))
      }
      await dispatch(getSessionTasksStatus(sessionId))
    }

    const onNextQuestion = () => {
      if (!nextTaskId) {
        setPopupType("tasks")
        return
      }
      navigate(`/exam-window/${examCode}/${sessionId}/${nextTaskId}`, {
        replace: true
      })
    }

    const onPrevTaskClick = () => {
      if (!prevTaskId) return
      navigate(
        `/exam-window/${params.examCode}/${params.sessionId}/${prevTaskId}`,
        {replace: true}
      )
    }

    const resetQuestionVariables = () => {
      setReadyToBeFinished(false)
      setKpCodeAnswer(null)
      setDifferentTypeAnswers(null)
      setAnswerConfirmed(false)
    }

    useImperativeHandle(ref, () => ({
      async nextTask() {
        if (!readyToBeFinished) {
          await NextTaskFunctionality()
          setPopupType(null)
        } else {
          await dispatch(getSessionTasksStatus(sessionId))
          setPopupType("tasks")
        }
      },

      async repeatQuestion() {
        resetQuestionVariables()
        await dispatch(getTasksAnswers(sessionId))
      }
    }))

    const instanceRunningHandler = async () => {
      if (isWordpressExam) {
        await dispatch(startSessionExam(sessionId))
        // if(localStorage.getItem("instructionsOpen")){
        //   setInstructions()
        //   localStorage.removeItem("instructionsOpen")
        // }
      }
    }

    // const handleCodeAnswer = (code: string) => {
    //   setKpCodeAnswer(code)
    //   if (currentTaskType === "practical" && !!code) {
    //     submitTask(code)
    //   }
    // }

    return (
      <>
        {sessionInstance && openHint && (
          <SnackbarCredentials
            open={openHint}
            handleClose={() => setOpenHint(false)}
            username={sessionInstance.username}
            password={sessionInstance.password}
          />
        )}

        <Grid
          item
          xs={12}
          className={`${sphereEngineWorkSpace} ${sphereEngineWorkSpaceBasic} 
        ${openDoc && customStyles}`}
        >
          {openDoc && (
            <div className={pdfWrapper}>
              <CustomPdfModal open={openDoc} setOpen={setOpenDoc} />
            </div>
          )}

          {isWordpressExam && sessionInstance?.status !== "running" ? (
            <Backdrop className={backdrop} open={true}>
              <Typography variant="h6" align="center">
                We are currently preparing your test environment and it may take
                few minutes. <br />
                <b>Please don't refresh or close the tab.</b>
              </Typography>
              <CircularProgress className={progressBar} color="inherit" />
            </Backdrop>
          ) : isWordpressExam && currentTaskType !== "multiple" ? (
            <WordpressExamSpace
              setOpenHint={setOpenHint}
              iframeWasLoaded={iframeWasLoaded}
              setIframeWasLoaded={setIframeWasLoaded}
            />
          ) : (
            <WorkSpace
              setKpCodeAnswer={setKpCodeAnswer}
              setDifferentTypeAnswers={setDifferentTypeAnswers}
              setRunDisabled={setRunDisabled}
              taskAnswer={taskAnswer}
              codeEditorData={codeEditorData}
              tasksAmount={sessionTasks?.length}
              currentTaskNumber={currentTaskIndex + 1}
              onNextClick={NextTaskFunctionality}
              onRefresh={onRefresh}
              nextDisabled={loading || runDisabled}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          className={`${sphereEngineFooter} ${sphereEngineFooterBasic}`}
        >
          <Box className={loadingBarContainer}>
            {loading || runDisabled ? <LinearProgress /> : null}
          </Box>
          <TaskFooterFirstBar
            handleFlagClick={handleFlagClickFooter}
            currentTaskNumber={currentTaskIndex + 1}
            tasksAmount={sessionTasks?.length}
            setOpenHint={setOpenHint}
            btnFlaggedDisable={loading}
            setOpenDoc={setOpenDoc}
            openDoc={openDoc}
            isTaskFlagged={isTaskFlagged}
            questionType={!isWordpressExam && question.type}
            examCode={examCode}
            isWordpressExam={isWordpressExam}
            onFullButtonClick={onFullButtonClick}
            isFullScreen={isFullScreen}
          />

          {isWordpressExam && <Description />}

          <TaskFooterSecondBar
            nextDisabled={loading || runDisabled}
            prevDisabled={!prevTaskId}
            onNextClick={NextTaskFunctionality}
            onPrevClick={onPrevTaskClick}
            onNextQuestion={onNextQuestion}
            nextBtnLabel="Submit Task"
            isTaskFlagged={isTaskFlagged}
            skipTaskShow={nextTaskId}
          />
        </Grid>
      </>
    )
  }
)

export default memo(DefaultExamWindow)
