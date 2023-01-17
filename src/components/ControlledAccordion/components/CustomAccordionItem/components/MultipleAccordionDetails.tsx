import React from "react"
import {createStyles, makeStyles} from "@mui/styles"
import {docco} from "react-syntax-highlighter/dist/cjs/styles/hljs"
import SyntaxHighlighter from "react-syntax-highlighter"
import {ICustomAccordionItemProps} from "../index"

const useStyles = makeStyles(() =>
  createStyles({
    qdescription: {
      color: "#172b4d",
      fontWeight: "bold",
      padding: "10px 0"
    },
    rightAnswerWrap: {
      border: "1px solid #0000002b",
      padding: "0 10px",
      "& .syn-hlight-wrapper, .mult-root-c-label": {
        marginBottom: 0
      }
    },
    codeSnippetClass: {
      display: "flex",
      alignItems: "center",
      minWidth: "300px",
      backgroundColor: "rgb(248, 248, 255)",
      fontSize: "14px",
      margin: "0 0 20px 0"
    }
  })
)

interface Props
  extends Pick<
    ICustomAccordionItemProps,
    "codeSnippet" | "description" | "answerToRender"
  > {}

export default function MultipleAccordionDetails({
  description,
  codeSnippet,
  answerToRender
}: Props) {
  const {qdescription, codeSnippetClass, rightAnswerWrap} = useStyles()

  return (
    <>
      <div className={qdescription}>{description}</div>
      {codeSnippet && (
        <div className={` qcd-syntax-wrap ${codeSnippetClass}`}>
          <SyntaxHighlighter
            language={codeSnippet?.language || "python"}
            style={docco}
          >
            {codeSnippet?.code || ""}
          </SyntaxHighlighter>
        </div>
      )}
      <div className={rightAnswerWrap}>{answerToRender}</div>
    </>
  )
}
