import React from "react"
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {MultipleCorrectAnswerProps} from "./types.t"

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(2),
    width: "100%"
  },
  formGroup: {},
  formControlLabel: {}
}))

export default function MultipleCorrectAnswer({
  correctAnswer
}: MultipleCorrectAnswerProps) {
  const {formControl, formControlLabel, formGroup} = useStyles()

  return (
    <FormControl
      component="fieldset"
      className={`${formControl} mult-root-c-label`}
    >
      <FormGroup className={formGroup}>
        {correctAnswer &&
          correctAnswer.map((el) => {
            return (
              <FormControlLabel
                key={el.id}
                className={`${formControlLabel} mult-form-c-label`}
                control={<Checkbox color={"primary"} checked={true} name={el.text} />}
                label={el.text}
              />
            )
          })}
      </FormGroup>
    </FormControl>
  )
}
