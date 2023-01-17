import fromAbbrToWords from "consts/fromAbbrToWords"
import React, {useEffect, useState} from "react"
import {
  Box,
  Button,
  FormControl, Grid,
  MenuItem,
  Select,
  Typography
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {ILicenseItem} from "types/common"

const useStyles = makeStyles(() => ({
  formControl: {
    width: "100%",
    boxSizing: "content-box",
    "& *": {
      boxSizing: "content-box !important"
    }
  }
  // form: {
  //   width: "40%",
  //   maxHeight: "95%",
  //   overflow: "auto",
  //   [theme.breakpoints.down("xl")]: {
  //     width: "55%",
  //     minWidth: "0"
  //   },
  //   [theme.breakpoints.down("lg")]: {
  //     width: "65%",
  //     minWidth: "0"
  //   },
  //   [theme.breakpoints.down("md")]: {
  //     width: "80%",
  //     minWidth: "0"
  //   },
  //   [theme.breakpoints.down(undefined)]: {
  //     width: "95%",
  //     minWidth: "0"
  //   }
  // }
}))

const assignSelectRowMock = {
  examCode: {
    name: "examCode",
    label: "Select Practice Test",
    value: "default",
    isError: false,
    options: [{label: "No exams available", value: "default"}]
  },
  inventory: {
    name: "inventory",
    label: "Select Inventory",
    value: "license",
    isError: false,
    options: [
      {label: "License Inventory", value: "license"},
      {label: "Vouchers Inventory", value: "vouchers"}
    ]
  },
  licenseCode: {
    name: "licenseCode",
    label: "Select Inventory",
    value: "default",
    isError: false,
    options: []
  }
}

interface Props {
  availableExamCodes: { code: string, displayCode: string }[]
  licensesByExamCode: ILicenseItem[]
  onExamCodeChanged: (examCode: string) => void
  onFormSubmit: (form: {examCode: string, licenseCode?: string}) => void
  checkedStudentsCounter: number
}

export default function AssignPracticeTestForm({
  availableExamCodes,
  onExamCodeChanged,
  licensesByExamCode,
  onFormSubmit,
  checkedStudentsCounter
}: Props) {
  const s = useStyles()

  const [assignSelectRow, setAssignSelectRow] = useState(assignSelectRowMock)

  useEffect(() => {
    if (!availableExamCodes?.length) {
      setAssignSelectRow((prev) => ({
        ...prev,
        examCode: {
          ...prev.examCode,
          options: [{label: "No exams available", value: "default"}],
          value: "default"
        }
      }))

      return
    }

    setAssignSelectRow((prev) => ({
      ...prev,
      examCode: {
        ...prev.examCode,
        options: availableExamCodes.map((_) => ({
          label: _.displayCode,
          value: _.code
        })),
        value: availableExamCodes[0].code
      }
    }))

    onExamCodeChanged(availableExamCodes[0].code)
  }, [availableExamCodes])

  useEffect(() => {
    if (!licensesByExamCode?.length) {
      setAssignSelectRow((prev) => ({
        ...prev,
        licenseCode: {
          ...prev.licenseCode,
          options: [],
          value: ""
        }
      }))

      return
    }

    setAssignSelectRow((prev) => ({
      ...prev,
      licenseCode: {
        ...prev.licenseCode,
        options: licensesByExamCode.map((license) => ({
          label: "" + license.name,
          value: license.code
        })),
        value: "" + licensesByExamCode[0].code
      }
    }))
  }, [licensesByExamCode])

  const handleChangeSelect = (e) => {
    if (e.target.name === "examCode") {
      onExamCodeChanged(e.target.value)
    }

    setAssignSelectRow((prevState) => ({
      ...prevState,
      [e.target.name]: {
        ...prevState[e.target.name],
        value: e.target.value
      }
    }))
  }

  const handleSelectFocus = (name) => {
    setAssignSelectRow((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        isError: false
      }
    }))
  }

  const onSubmitForm = (e) => {
    e.preventDefault()

    const form: { examCode: string, licenseCode?: string } = {
      examCode: null
    }

    if (assignSelectRow.examCode.value !== "default") {
      form["examCode"] = assignSelectRow.examCode.value
    }

    if (assignSelectRow["inventory"].value === "license" && assignSelectRow.licenseCode.value) {
      form["licenseCode"] = assignSelectRow.licenseCode.value
    }

    if (form.examCode) onFormSubmit(form)
  }

  return (
    <form onSubmit={onSubmitForm}>
      <Box mx={10}>
        <Typography variant="h6" textAlign="center" p={2}>
          Assign Practice Tests
        </Typography>
        <Box minWidth="20vw">
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <Typography>
                  Selected students:
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography fontWeight="bold">
                  {checkedStudentsCounter}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box>
            {assignSelectRow && Object.values(assignSelectRow).reduce(
              (acc, {
                name,
                label,
                options,
                value,
                isError
              }) => {
                if (!options?.length) return acc
                if (name === "inventory") return acc
                if (name === "licenseCode" && assignSelectRow["inventory"].value !== "license") return acc

                acc.push(
                  <Box key={name} mt={2}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={7}>
                        <Typography>
                          {label}:
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl className={s.formControl}>
                          <Select
                            labelId={label}
                            name={name}
                            value={value ? value : ""}
                            error={isError}
                            onChange={handleChangeSelect}
                            onFocus={() => handleSelectFocus(name)}>
                            {options?.map(({label, value}) => {
                              return (
                                <MenuItem key={label} value={value}>
                                  {fromAbbrToWords[value] ? `${label} - ${fromAbbrToWords[value]}` : label}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {isError && (
                      <Typography variant="subtitle2" color="error">
                        {label} field is required
                      </Typography>
                    )}
                  </Box>
                )

                return acc
              }, []
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="end" p={2}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={!licensesByExamCode?.length}>
          Submit
        </Button>
      </Box>
    </form>
  )
}
