import React from "react"
import CheckInputOption from "./CheckInputOption"
import {Box, FormControl, FormHelperText, NativeSelect} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {OptionsColumnProps} from "pages/PracticeModeOptions/types.t"

const useStyles = makeStyles({
  rowsWrap: {
    overflow: "auto",
    flexGrow: 1
  },
  selectEmpty: {
    boxSizing: "content-box",
    "& *": {
      boxSizing: "content-box !important"
    }
  },
  formControl: {
    maxWidth: "500px",
    marginTop: "2rem",
    boxSizing: "content-box",
    "& *": {
      boxSizing: "content-box !important"
    }
  }
})

export default function OptionsColumn({
  handleCheck,
  handleSelectChange,
  handleInput,
  setIsModal,
  fields,
  selectState
}: OptionsColumnProps) {
  const styles = useStyles()

  return (
    <Box className={styles.rowsWrap}>
      {Object.values(fields).map(i => {
        return (
          <CheckInputOption
            key={i.id}
            handleChange={handleCheck}
            isChecked={i.isChecked}
            fieldName={i.fieldName}
            preDescription={i.preDescription}
            postDescription={i.postDescription}
            buttonText={i.buttonText}
            onModalButtonClick={() => setIsModal(i.fieldName, true)}
            onInput={handleInput}
          />
        )
      })}
      <FormControl className={styles.formControl}>
        <NativeSelect
          value={selectState}
          onChange={handleSelectChange}
          className={styles.selectEmpty}
          inputProps={{
            "aria-label": "age"
          }}>
          <option value="end">
            Do not display any answers until the test is complete
          </option>
          <option value="task">
            Autodisplay answers to any response
          </option>
        </NativeSelect>
        <FormHelperText>
          The option specifies how you want to request answers and explanations
          during the test.
        </FormHelperText>
      </FormControl>
    </Box>
  )
}
