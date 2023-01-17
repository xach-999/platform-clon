import React, {FC, useCallback, useMemo, memo} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  MultipleChoiceQuestion,
  DnDQuestion,
  ParsonsQuestion
} from "@knowledge-pillars-education-inc/kp-fe-lib"
import BackdropLoad from "components/BackdropLoad"
import {selectTaskDetails} from "store/selectors"
import {WorkSpacePropsType} from "pages/PracticeExamWindow/types.t"
import SphereEngineWorkSpace from "./SphereEngineWorkSpace"
import {Box} from "@mui/material"
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles(() => ({
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: "20px 20px 40px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    overflowY: "auto",
    background: "white"
  }
}))

const WorkSpace: FC<WorkSpacePropsType> = ({
  setDifferentTypeAnswers,
  setKpCodeAnswer,
  setRunDisabled,
  taskAnswer,
  codeEditorData,
  onNextClick,
  onRefresh,
  submitLoading,
  tasksAmount,
  currentTaskNumber,
  nextDisabled
}) => {
  const dispatch = useDispatch()

  const question = useSelector(selectTaskDetails)

  const {
    type,
    answers,
    questions,
    description,
    displayName,
    multipleDetails
  } = useMemo(() => {
    return question
  }, [JSON.stringify(question)]) 

  const codeString = useMemo(() => {
    if (multipleDetails?.codeSnippet) {
      return multipleDetails?.codeSnippet["code"]
    }
    return ""
  }, [multipleDetails])

  const {wrapper} = useStyles()

  const MultipleChoicesHandler = (result) => {
    const answers = result.reduce((acc, el) => {
      if (el.checked) acc.push({id: el.id})
      return acc
    }, [])
    setDifferentTypeAnswers(answers?.length ? answers : null)
  }
  const DndChangesHandler = useCallback(
    (dndAnswers) => {
      let result = dndAnswers
      if (dndAnswers)
        result = dndAnswers.map((el) => ({id: el.id, position: el.position}))
      setDifferentTypeAnswers(result)
    },
    [dispatch]
  )

  const ParsonsCodeChanges = useCallback(
    (code) => {
      let result = code
      if (code)
        result = code.map((el) => ({id: el.id, position: el.position}))
      setDifferentTypeAnswers(result)
    },
    [dispatch]
  )

  const DndQuestionPlugin = useMemo(() => {
    return (
      <Box className={wrapper}>
        <DnDQuestion
          questionLines={questions}
          answerLines={answers}
          selectedAnswers={taskAnswer?.answers || []}
          description={description}
          displayName={displayName}
          changesHandler={DndChangesHandler}
        />
      </Box>
    )
  }, [
    DndChangesHandler,
    questions,
    answers,
    description,
    displayName,
    taskAnswer,
    wrapper
  ])
  const ParsonsQuestionPlugin = useMemo(() => {
    return (
      <Box className={wrapper}>
        <ParsonsQuestion
          questionLines={answers}
          description={description}
          selectedAnswers={taskAnswer?.answers || []}
          displayName={displayName}
          codeSnippet={codeString}
          codeSnippetLanguage={multipleDetails?.codeSnippet?.language}
          language="javascript"
          handleCodeChanges={ParsonsCodeChanges}
        />
      </Box>
    )
  }, [
    answers,
    description,
    displayName,
    ParsonsCodeChanges,
    multipleDetails,
    codeString,
    taskAnswer,
    wrapper
  ])

  const MultipleChoiceQuestionPlugin = useMemo(() => {
    return (
      <Box className={wrapper}>
        <MultipleChoiceQuestion
          onChange={MultipleChoicesHandler}
          loading={false}
          codeString={codeString}
          options={multipleDetails?.options}
          selectedOptions={taskAnswer?.answers}
          displayName={displayName}
          language={multipleDetails?.codeSnippet?.language}
          description={description}
        />
      </Box>
    )
  }, [
    description,
    displayName,
    multipleDetails,
    codeString,
    taskAnswer,
    wrapper
  ])

  return (
    <>
      {type === "match" ? (
        DndQuestionPlugin
      ) : type === "practical" ? (
        <SphereEngineWorkSpace
          question={question}
          setKpCodeAnswer={setKpCodeAnswer}
          setRunDisabled={setRunDisabled}
          codeEditorData={codeEditorData}
          onNextClick={onNextClick}
          onRefresh={onRefresh}
          submitLoading={submitLoading || nextDisabled}
          tasksAmount={tasksAmount}
          currentTaskNumber={currentTaskNumber}
        />
      ) : type === "multiple" ? (
        MultipleChoiceQuestionPlugin
      ) : type === "parsons" ? (
        ParsonsQuestionPlugin
      ) : (
        <BackdropLoad open/>
      )}
    </>
  )
}

export default memo(WorkSpace)
