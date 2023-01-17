import React from "react"
import {makeStyles} from "@mui/styles"
import {MatchCorrectAnswerProps} from "./types.t"

const useStyles = makeStyles({
  root: {
    paddingTop: "10px"
  },
  lineWrap: {
    margin: "0 0px 10px 0px",
    display: "flex",
    padding: "5px",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    borderRadius: "4px"
  },
  questionSide: {
    flexBasis: "50%"
  },
  answerSide: {
    textAlign: "left",
    flexBasis: "50%"
  },
  dividerArrow: {
    padding: "0 5px",
    alignSelf: "center",
    "& svg": {
      width: "0.5em",
      margin: "0 10px"
    }
  }
})

export default function MatchCorrectAnswer({
  correctAnswer
}: MatchCorrectAnswerProps) {
  const {questionSide, lineWrap, root} = useStyles()

  return (
    <div className={root}>
      {correctAnswer &&
        correctAnswer
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((line) => {
            return (
              <div className={lineWrap} key={line.id}>
                <div className={questionSide}>{line.text}</div>
              </div>
            )
          })}
    </div>
  )
}
