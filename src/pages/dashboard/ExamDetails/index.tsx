import {LINKS} from "consts/links"
import React, {useEffect, useMemo} from "react"
import {Helmet} from "react-helmet-async"
import {Box, Container, Grid} from "@mui/material"
import useSettings from "hooks/useSettings"
import {useDispatch} from "react-redux"
import ExamDetailsInfo from "./components/ExamDetailsInfo"
import ExamDetailsObjectives from "./components/ExamDetailsObjectives"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {
  fetchSessionExamDetails,
  resetSessionInfo
} from "store/slices/practiceSession/practiceSession"
import {useSelector} from "store"
import BackdropLoad from "components/BackdropLoad"
import CustomBreadcrumbs from "components/CustomBreadcrumbs"
import {
  clearCurrentExamDetails,
  fetchExamDetailsByIdThunk
} from "store/slices/exams"
import useMainPageLink from "hooks/useMainPageLink"
import {unwrapResult} from "@reduxjs/toolkit"
import {ICorrectAnswers} from "pages/PracticeAnswers"
import ControlledAccordion from "components/ControlledAccordion"

export default function ExamDetails() {
  const {settings} = useSettings()
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const session = useSelector((state) => {
    if (params.sessionId) {
      const loading = state.practiceSession.loading
      const curr = state.practiceSession.currentSession
      const {
        result,
        examCode,
        userName,
        examName,
        finishDate,
        status,
        displayCode,
        options
      } = curr || {}

      const {score, isPassed, objectives} = result || {}

      return {
        examCode,
        displayCode,
        score,
        isPassed,
        objectives,
        userName,
        examName,
        finishDate,
        loading,
        status,
        showAnswers: options?.showResult || undefined
      }
    }

    if (params.examId) {
      const loading = state.examsSlice.loading
      const curr = state.examsSlice.currentExamDetails
      const {
        score,
        isPassed,
        objectives,
        userName,
        examName,
        finishDate,
        examCode,
        displayCode,
        accredibleCredentialId
      } = curr || {}

      return {
        examCode,
        displayCode,
        score,
        isPassed,
        objectives,
        userName,
        examName,
        finishDate,
        loading,
        accredibleCredentialId,
        showAnswers: undefined
      }
    }
  })

  const currentSession = useSelector(state => state.practiceSession.currentSession)

  const {mainPageLink, isStudent} = useMainPageLink()

  const serializedObjectives = useMemo(() => {
    if (!session.objectives?.length) return []

    return session.objectives.map((obj) => {
      return {...obj, color: obj.score > 74 ? "#1ddc47" : "#ea4545"}
    })
  }, [session.objectives])

  const isPractice = useMemo(() => {
    if (!location.pathname) return false

    return location?.pathname.includes("practice-results")
  }, [location?.pathname])

  const serializedTasks: Array<ICorrectAnswers> = useMemo(() => {
    if (!isPractice) return null

    const tasks = currentSession?.tasks

    if (!tasks?.length) return []

    return tasks.reduce((acc, item) => {
      const {id, validated, task, correctAnswer} = item || {}
      const {description, displayName, type, multipleDetails} = task || {}
      const codeSnippet = multipleDetails?.codeSnippet || null

      if (!displayName) return acc

      const taskObject = {
        id,
        validated,
        correctAnswer,
        description,
        displayName,
        type,
        codeSnippet
      }

      acc.push(taskObject)

      return acc
    }, [])
  }, [currentSession?.tasks, isPractice])

  const breadcrumbsPathBack = useMemo(() => {
    if (isStudent) {
      return isPractice ? "/practice-results" : "/my-results"
    }

    return isPractice ? "/student-practice-results" : LINKS.classrooms
  }, [isStudent, isPractice])

  useEffect(() => {
    if (!params?.examId) return

    const initPage = async () => {
      try {
        const wrappedDetails = await dispatch(fetchExamDetailsByIdThunk(params.examId))

        unwrapResult(wrappedDetails as any)
      } catch (err) {
        console.warn(err)
        navigate(mainPageLink)
      }
    }

    initPage()
  }, [params?.examId])

  useEffect(() => {
    if (!params?.sessionId) return

    const initPage = async () => {
      try {
        const wrappedDetails = await dispatch(fetchSessionExamDetails(params.sessionId))

        unwrapResult(wrappedDetails as any)
      } catch (err) {
        console.warn(err)
        navigate(mainPageLink)
      }
    }

    initPage()
  }, [params?.sessionId])

  useEffect(() => {
    return () => {
      dispatch(resetSessionInfo())
      dispatch(clearCurrentExamDetails())
    }
  }, [])

  return (
    <>
      <BackdropLoad open={session.loading}/>
      <Helmet>
        <title>
          {" "}
          {isPractice ? "Practice Test Details" : "Exam Details"} | KP
          Platform
        </title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3
        }}>
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between">
            <CustomBreadcrumbs
              breadcrumbs={[{
                text: "Dashboard",
                path: mainPageLink
              }, {
                text: isPractice ? "Practice Results" : "My Results",
                path: breadcrumbsPathBack
              }, {
                text: `${session.examName || "Unknown"} (${session.examCode || "Unknown"})${
                  isPractice ? " - Practice Test" : ""
                }`
              }]}
              title={isPractice ? "My Practice Test Results" : "My Results"}
            />
          </Grid>
          <Box sx={{mt: 3}}>
            <ExamDetailsInfo
              examScore={session.score}
              examStatus={session.isPassed}
              examCode={session.examCode}
              displayCode={session.displayCode}
              candidateName={session.userName}
              examName={session.examName}
              finishDate={session.finishDate}
              isPractice={isPractice}
              showAnswers={session.showAnswers}
              status={session.status}
              accredibleCredentialId={session.accredibleCredentialId}
            />
            {session.status !== "in-progress" ? (
              <ExamDetailsObjectives
                objectives={serializedObjectives}
                isPassed={session.isPassed}
                isPracticeResPage={isPractice}
                examName={session.examName}
                examCode={session.examCode}
              />
            ) : null}
          </Box>
          {!!serializedTasks?.length && (
            <Box mt={3}>
              <ControlledAccordion answers={serializedTasks} backgroundColorProp="#fff"/>
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}
