import React, {useEffect, useState} from "react"
import {CodeCorrectAnswerProps} from "./types.t"
import {makeStyles} from "@mui/styles"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {a11yDark} from "react-syntax-highlighter/dist/esm/styles/prism"

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    "& code": {
      whiteSpace: "pre-wrap !important"
    }
  }
}))

export default function CodeCorrectAnswer({
  correctAnswer
}: CodeCorrectAnswerProps) {
  const {root} = useStyles()

  const [code, setCode] = useState("")

  useEffect(() => {
    if (!correctAnswer?.length) return

    const sorted = correctAnswer
      .slice()
      .sort((a, b) => a.position - b.position)
    let codeString = ""

    sorted.forEach((item) => {
      codeString += `\n${item.text}`
    })

    setCode(codeString)
  }, [correctAnswer])

  return (
    <>
      {code && (
        <div className={`${root} syn-hlight-wrapper`}>
          <SyntaxHighlighter language={"javascript"} style={a11yDark}>
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </>
  )
}
