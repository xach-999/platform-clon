import React, {useEffect, useState} from "react"
import {Box, Checkbox, FormControlLabel, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"
import Button from "@mui/material/Button"
import {CheckInputOptionProps} from "pages/PracticeModeOptions/types.t"

const useStyles = makeStyles({
  optionRow: {
    display: "flex",
    alignItems: "center"
  },
  textInput: {
    borderRadius: "4px",
    border: "1px solid #ddd",
    padding: "5px",
    maxWidth: "50px",
    marginRight: "10px"
  }
})

export default function CheckInputOption({
  handleChange,
  isChecked,
  preDescription,
  postDescription,
  fieldName,
  buttonText,
  onInput,
  onModalButtonClick
}: CheckInputOptionProps) {
  const s = useStyles()

  const [inputValue, setInputValue] = useState("45")
  const [timeoutKey, setTimeoutKey] = useState(null)

  const onInputHandler = (e) => {
    const inputValue = e.target.value
    setInputValue(inputValue)
    onInput({
      fieldName,
      inputValue: inputValue
    })
  }

  useEffect(() => {
    if (!inputValue || !onInput) return
    if (fieldName !== "duration") return

    if (timeoutKey) clearTimeout(timeoutKey)

    let timeout = setTimeout(() => {
      let val = typeof inputValue === "string" ? Number.parseInt(inputValue) : inputValue
      val = val < 6 ? 6 : val > 6 * 60 ? 6 * 60 : val

      if (inputValue !== `${val}`) {
        onInput({
          fieldName,
          inputValue: `${val}`
        })
        setInputValue(`${val}`)
      }
    }, 1000)

    setTimeoutKey(timeout)

    return () => {
      clearTimeout(timeoutKey)
    }
  }, [inputValue, onInput])

  return (
    <Box className={s.optionRow}>
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={handleChange}
              name={fieldName}
              color="primary"
            />
          }
          label={preDescription}
        />
      </Box>
      {postDescription && (
        <Box>
          <input
            className={s.textInput}
            value={inputValue}
            type="number"
            min={fieldName === "duration" ? 6 : 0}
            max={60}
            disabled={!isChecked}
            onChange={onInputHandler}
          />
          <Typography variant="body1" display="inline">
            {postDescription}
          </Typography>
        </Box>
      )}
      {buttonText && (
        <Button
          disabled={!isChecked}
          variant="contained"
          color="primary"
          size="small"
          onClick={onModalButtonClick}>
          {buttonText}
        </Button>
      )}
    </Box>
  )
}
