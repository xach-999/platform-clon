import {Box} from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import useKpEditor from "hooks/useKpEditor"
import React, {useEffect} from "react"
import {makeStyles} from "@mui/styles"
import {SphereEnginePropsType} from "pages/PracticeExamWindow/types.t"
import {CodeEditor} from "@knowledge-pillars-education-inc/kp-fe-lib"

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    "& .kps-out-collapse": {
      cursor: "pointer"
    }
  },
  spinner: {
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    zIndex: 2
  }
}))

export default function SphereEngineWorkSpace({
  question,
  setKpCodeAnswer,
  setRunDisabled,
  codeEditorData,
  onNextClick,
  onRefresh,
  submitLoading,
  tasksAmount,
  currentTaskNumber
}: SphereEnginePropsType) {
  const s = useStyles()

  const {problem, practicalDetails} = question

  const {compileAnswer, runDisabled, onRunCode} = useKpEditor(question)

  useEffect(() => {
    setRunDisabled(runDisabled)
  }, [runDisabled])

  const handleRunCode = (code) => {
    onRunCode(code)
    setKpCodeAnswer(code || " ")
  }

  return (
    <Box className={s.root}>
      {!problem ? (
        <Box className={s.spinner}>
          <CircularProgress color="inherit" disableShrink/>
        </Box>
      ) : (
        <CodeEditor
          noFooter
          info={{
            input: problem.body
          }}
          code={{
            lang: practicalDetails.language,
            template: question?.practicalDetails?.template,
            input: codeEditorData,
            onRun: handleRunCode,
            onRefresh,
            submissionLoading: runDisabled,
            alert: compileAnswer ? {
              code: compileAnswer.status_code,
              name: compileAnswer.status_name,
              labels: {
                15: "compiled"
              }
            } : null
          }}
          compiled={compileAnswer?.cmpinfo || compileAnswer?.error || compileAnswer?.output || compileAnswer?.signal_desc}
          tasksAmount={tasksAmount}
          currentTaskNumber={currentTaskNumber}
          onAnswerChange={setKpCodeAnswer}
          onSubmitTask={onNextClick}
          submitLoading={submitLoading}
        />
      )}
    </Box>
  )
}
