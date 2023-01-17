import React from "react"
import {createStyles, makeStyles} from "@mui/styles"
import CodeCorrectAnswer from "./components/PopupContainer/CodeCorrectAnswer"
import {
  IMultipleCorrectAnswer,
  WithPositionAnswer
} from "./components/PopupContainer/types.t"
import MultipleCorrectAnswer from "./components/PopupContainer/MultipleCorrectAnswer"
import MatchCorrectAnswer from "./components/PopupContainer/MatchCorrectAnswer"
import CustomAccordionItem from "./components/CustomAccordionItem"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      "& .css-1laz6mr-MuiPaper-root-MuiAccordion-root.Mui-expanded": {
        margin: 0
      },
      "& .css-o4b71y-MuiAccordionSummary-content.Mui-expanded": {
        margin: "12px 0"
      },
      "& .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded":
        {
          minHeight: "48px"
        }
    }
  })
)

export interface IQuestionItem {
  id: string
  type: string
  displayName: string
  description: string
  validated: boolean
  correctAnswer: IMultipleCorrectAnswer | WithPositionAnswer
  codeSnippet: {
    code: string
    language: string
  } | null
}

interface Props {
  answers: Array<IQuestionItem>
  backgroundColorProp?: string
}

export default function ControlledAccordions({
  answers,
  backgroundColorProp
}: Props) {
  const s = useStyles()

  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const renderQuestionHelper = (
    type: string,
    correctAnswerArg: IMultipleCorrectAnswer | WithPositionAnswer
  ) => {
    switch (type) {
      case "multiple":
        return <MultipleCorrectAnswer correctAnswer={correctAnswerArg} />
      case "match":
        return <MatchCorrectAnswer correctAnswer={correctAnswerArg} />
      case "parsons":
      case "practice":
        return <CodeCorrectAnswer correctAnswer={correctAnswerArg} />
      default:
        return <div />
    }
  }

  return (
    <div className={s.root}>
      {answers &&
        answers.map((task) => {
          const {
            description,
            displayName,
            correctAnswer,
            id,
            type,
            validated,
            codeSnippet
          } = task
          return (
            <CustomAccordionItem
              backgroundColorProp={backgroundColorProp}
              key={id}
              expanded={expanded === id}
              handleChange={handleChange}
              answerToRender={renderQuestionHelper(type, correctAnswer)}
              id={id}
              type={type}
              displayName={displayName}
              description={description}
              validated={validated}
              codeSnippet={codeSnippet}
            />
          )
        })}
    </div>
  )
}
