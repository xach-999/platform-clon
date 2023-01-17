import React, {SyntheticEvent} from "react"
import AccordionSummary from "@mui/material/AccordionSummary"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Typography from "@mui/material/Typography"
import AccordionDetails from "@mui/material/AccordionDetails"
import Accordion from "@mui/material/Accordion"
import {makeStyles} from "@mui/styles"
import {IQuestionItem} from "../../index"
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace"
import MultipleAccordionDetails from "./components/MultipleAccordionDetails"
import {Theme} from "@mui/material"

const useStyles = makeStyles((theme: Theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.success.main,
    "&.failed-color": {
      color: theme.palette.error.main
    }
  },
  accHeaderLine: ({
    backgroundColorProp
  }: {
    backgroundColorProp: string
  }) => ({
    backgroundColor: backgroundColorProp,
    color: "#172b4d"
  })
}))

export interface ICustomAccordionItemProps
  extends Omit<IQuestionItem, "correctAnswer"> {
  expanded: boolean
  handleChange: (
    panel: string
  ) => (event: SyntheticEvent<Element, Event>, expanded: boolean) => void
  answerToRender: ReactJSXElement
  backgroundColorProp?: string
}

export default function CustomAccordionItem({
  expanded,
  handleChange,
  id,
  displayName,
  validated,
  description,
  answerToRender,
  codeSnippet,
  type,
  backgroundColorProp = "#dddddd4f"
}: ICustomAccordionItemProps) {
  const {accHeaderLine, heading, secondaryHeading} = useStyles({
    backgroundColorProp
  })

  return (
    <Accordion expanded={expanded} key={id} onChange={handleChange(id)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={accHeaderLine}
      >
        <Typography className={heading}>{displayName}</Typography>
        <Typography
          className={`${secondaryHeading} ${validated ? "" : "failed-color"}`}
        >
          {validated ? "Passed" : "Failed"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {type !== "practical" ? (
          <MultipleAccordionDetails
            description={description}
            codeSnippet={codeSnippet}
            answerToRender={answerToRender}
          />
        ) : (
          <Typography variant={"overline"}>
            For this moment we can`t provide answer for practical questions.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
