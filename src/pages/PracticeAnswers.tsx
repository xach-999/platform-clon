import React, {useEffect, useMemo} from "react"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import ControlledAccordions from "components/ControlledAccordion"
import {Button} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useNavigate} from "react-router-dom"
import {useParams} from "react-router"
import {
  IMultipleCorrectAnswer,
  WithPositionAnswer
} from "components/ControlledAccordion/components/PopupContainer/types.t"
import {useDispatch, useSelector} from "store"
import {fetchSessionExamDetails} from "store/slices/practiceSession/practiceSession"
import BackdropLoad from "components/BackdropLoad"
import useMainPageLink from "hooks/useMainPageLink"

const useStyles = makeStyles({
  continueButtonWrap: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "flex-end"
  }
})

export interface ICorrectAnswers {
  id: string
  type: string
  validated: boolean
  displayName: string
  description: string
  correctAnswer: IMultipleCorrectAnswer | WithPositionAnswer
  codeSnippet: {
    code: string
    language: string
  } | null
}

export default function PracticeAnswersPage() {
  const {continueButtonWrap} = useStyles()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const {mainPageLink} = useMainPageLink()

  const currentSession = useSelector(
    (state) => state.practiceSession.currentSession
  )
  const loading = useSelector((state) => state.practiceSession.loading)

  const pageTitleInfo = useMemo(() => {
    if (!currentSession || !currentSession?.examName)
      return "Practice Test Answers"
    let title = currentSession?.examName
    if (currentSession?.examCode) title += ` (${currentSession?.examCode})`
    title = `${title} - Practice Test`
    return title
  }, [currentSession])
  const serializedTasks: Array<ICorrectAnswers> = useMemo(() => {
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
  }, [currentSession])

  const onContinueClick = () => {
    navigate(`/practice-results/exam-details/${params.sessionId}`, {
      replace: true
    })
  }

  useEffect(() => {
    dispatch(fetchSessionExamDetails(params.sessionId))
  }, [params.sessionId])

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={"Practice Test Options"}
      pageTitle={pageTitleInfo}
      breadcrumbs={[
        {
          text: "Dashboard",
          path: mainPageLink
        },
        {
          text: `${pageTitleInfo}`
        }
      ]}
    >
      <BackdropLoad open={loading} />
      <ControlledAccordions answers={serializedTasks} />
      <div className={continueButtonWrap}>
        <Button color="primary" variant="contained" onClick={onContinueClick}>
          Continue
        </Button>
      </div>
    </CardWithBreadcrumbs>
  )
}
