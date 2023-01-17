import {createStyles, makeStyles} from "@mui/styles"
import React, {useEffect, useMemo, useState} from "react"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography
} from "@mui/material"
import {LINKS} from "consts/links"
import {useDispatch, useSelector} from "store"
import {
  createTestingGroupThunk,
  fetchLicensesThunk,
  fetchSchoolTeachersThunk,
  fetchTestingGroupByIdThunk,
  fetchTestingGroupsThunk,
  setCurrentTestingGroup,
  updateTestingGroupThunk
} from "store/slices/schoolSlice/schoolSlice"
import {
  selectAllExamCodesForSelect,
  selectLicensesForSelect,
  selectTeachersAndProctorsForSelectOptions
} from "store/slices/schoolSlice/selectors"
import {getAvailableExamCodes} from "store/slices/exams"
import {useNavigate, useParams} from "react-router-dom"
import {INewTestingGroup, IVoucherItem} from "types/common"
import BackdropLoad from "components/BackdropLoad"
import {
  paymentTypeOptionsInitial,
  proctoringOptionsInitial,
  selectRowInitial
} from "./consts"
import {getVouchersBySchoolThunk} from "store/slices/practiceVouchers/practiceVouchers"
import useMainPageLink from "hooks/useMainPageLink"
import fromAbbrToWords from "consts/fromAbbrToWords"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
    form: {
      minWidth: "500px",
      [theme.breakpoints.down(undefined)]: {
        width: "95%",
        minWidth: "0"
      }
    },
    textField: {
      maxWidth: "500px"
    },
    selectEmpty: {
      boxSizing: "content-box",
      "& *": {
        boxSizing: "content-box !important"
      }
    },
    formControl: {
      width: "100%",
      boxSizing: "content-box",
      "& *": {
        boxSizing: "content-box !important"
      }
    }
  })
)

const findGroupFieldValue = (
  arr: Array<{ value: string, label: string | number }>,
  option: string,
  defaultValue?: string | number
): string => {
  if (!arr?.length) {
    if (defaultValue) return defaultValue + ""
    return ""
  }

  const founded = arr.find((el) => el.value === option || el.label === option)

  if (!founded) {
    if (defaultValue) return defaultValue + ""
    return ""
  }

  return founded.value ? founded.value + "" : ""
}

export default function AddTestingGroupPage() {
  const s = useStyles()

  const dispatch = useDispatch()
  const params = useParams()
  const navigator = useNavigate()
  const [cancel, setCancel] = useState(false)

  const [proctoringOptions] = useState(proctoringOptionsInitial)
  const [paymentTypeOptions] = useState(paymentTypeOptionsInitial)
  const [selectRow, setSelectRow] = useState(selectRowInitial)
  const [inputVal, setInputVal] = useState({
    value: "",
    isError: false
  })

  const {
    currentSchool: schoolId,
    loading,
    currentTestingGroup
  } = useSelector((store) => store.schoolSlice)
  const vouchers = useSelector<IVoucherItem[]>(
    (store) => store.practiceVouchers.currentSchoolVouchers
  )
  const {teachersOptions, proctorOptions} = useSelector(
    selectTeachersAndProctorsForSelectOptions
  )

  const licenseOptions = useSelector(selectLicensesForSelect)
  const availableExamCodesOptions = useSelector(selectAllExamCodesForSelect)

  const {mainPageLink} = useMainPageLink()

  const submitDisabled = useMemo(() => {
    if (
      !proctorOptions?.length &&
      selectRow["proctoring"].value === "classroom"
    )
      return true
    return !teachersOptions?.length
  }, [teachersOptions, selectRow, proctorOptions])
  const examHasAvailableVouchers = useMemo(() => {
    if (!selectRow.examCode.value) return false
    if (!vouchers?.length) return false

    return vouchers.some((el) => {
      if (!el?.examCode) return false
      return (
        el.examCode?.toLowerCase() === selectRow.examCode.value.toLowerCase()
      )
    })
  }, [vouchers, selectRow.examCode.value])

  useEffect(() => {
    if (!vouchers) dispatch(getVouchersBySchoolThunk(schoolId))
    return () => {
      dispatch(setCurrentTestingGroup(null))
    }
  }, [])

  useEffect(() => {
    if (!params?.groupId) return
    dispatch(fetchTestingGroupByIdThunk(params?.groupId))
  }, [params?.groupId])

  useEffect(() => {
    if (!licenseOptions) {
      dispatch(fetchLicensesThunk(schoolId))
      return
    }
  }, [licenseOptions])

  useEffect(() => {
    if (!teachersOptions || !schoolId) {
      dispatch(fetchSchoolTeachersThunk(schoolId))
      return
    }
    if (!teachersOptions?.length) return

    setSelectRow((prevState) => ({
      ...prevState,
      teacherUserId: {
        ...prevState["teacherUserId"],
        value: "",
        options: teachersOptions
      }
    }))
  }, [teachersOptions])

  useEffect(() => {
    if (!proctorOptions) return
    if (!proctorOptions?.length) return
    setSelectRow((prevState) => ({
      ...prevState,
      proctorUserId: {
        ...prevState["proctorUserId"],
        value: "",
        options: proctorOptions
      }
    }))
  }, [proctorOptions])

  useEffect(() => {
    if (!availableExamCodesOptions) {
      dispatch(getAvailableExamCodes())
      return
    }
    setSelectRow((prevState) => ({
      ...prevState,
      examCode: {
        ...prevState["examCode"],
        options: availableExamCodesOptions
      }
    }))
  }, [availableExamCodesOptions])

  useEffect(() => {
    if (!licenseOptions) return
    if (!selectRow.examCode.value) {
      setSelectRow((prevState) => ({
        ...prevState,
        licenseId: {
          ...prevState.licenseId,
          options: []
        }
      }))
      return
    }
    setSelectRow((prevState) => ({
      ...prevState,
      licenseId: {
        ...prevState.licenseId,
        // value: "",
        options: licenseOptions
          .filter((license) => license.productType === "exam")
          .reduce((acc, {label, value, examCodes}) => {
            if (examCodes.includes(prevState.examCode.value)) {
              acc.push({
                label,
                value
              })
            }
            return acc
          }, [])
      }
    }))
  }, [selectRow.examCode.value])

  useEffect(() => {
    if (!currentTestingGroup) return

    const {
      name,
      proctoring,
      examCode,
      proctorUserId,
      licenseId,
      teacherUserId,
      paymentType
    } = currentTestingGroup
    inputVal.value = name || ""

    setSelectRow((prevState) => ({
      ...prevState,
      examCode: {
        ...prevState["examCode"],
        value: findGroupFieldValue(availableExamCodesOptions, examCode)
      },
      proctoring: {
        ...prevState["proctoring"],
        value: findGroupFieldValue(proctoringOptions, proctoring, "classroom")
      },
      proctorUserId: {
        ...prevState["proctorUserId"],
        value: findGroupFieldValue(proctorOptions, proctorUserId)
      },
      licenseId: {
        ...prevState["licenseId"],
        value: findGroupFieldValue(licenseOptions, licenseId)
      },
      teacherUserId: {
        ...prevState["teacherUserId"],
        value: findGroupFieldValue(teachersOptions, teacherUserId)
      },
      paymentType: {
        ...prevState["paymentType"],
        value: findGroupFieldValue(paymentTypeOptions, paymentType)
      }
    }))
  }, [
    currentTestingGroup,
    licenseOptions,
    teachersOptions,
    proctorOptions,
    availableExamCodesOptions,
    paymentTypeOptions
  ])

  const onInputFocus = () => {
    setInputVal((prevState) => ({...prevState, isError: false}))
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    if(cancel) return navigator(-1)
    let isValid = true
    if (!inputVal.value) {
      isValid = false
      setInputVal((prevState) => ({...prevState, isError: true}))
    }
    const selectValues = Object.values(selectRow).reduce((acc, values) => {
      const {name, value} = values

      if (
        name === "proctorUserId" &&
        selectRow["proctoring"].value !== "classroom"
      )
        return acc
      if (
        name === "proctorUserId" &&
        !selectRow["proctorUserId"].options?.length
      )
        return acc
      if (
        name === "licenseId" &&
        selectRow["paymentType"].value !== "License inventory"
      )
        return acc
      if (name === "licenseId" && !selectRow["licenseId"].options?.length)
        return acc

      if (value && value !== "default") {
        acc[name] = value
        return acc
      }
      setSelectRow((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name],
          isError: true
        }
      }))
      isValid = false
      return acc
    }, {})

    const newGroup: INewTestingGroup = {
      ...(selectValues as Omit<INewTestingGroup, "name" | "schoolId">),
      name: inputVal.value,
      schoolId: schoolId
    }
    if (!isValid) return

    if (params.groupId) {
      delete newGroup.schoolId
      await dispatch(
        updateTestingGroupThunk({
          updatedTestingGroup: newGroup,
          id: currentTestingGroup?.id
        })
      )
    } else {
      await dispatch(createTestingGroupThunk(newGroup))
    }
    await dispatch(fetchTestingGroupsThunk({schoolId}))
    navigator(-1)
  }

  const handleChangeSelect = (e) => {
    setSelectRow((prevState) => ({
      ...prevState,
      [e.target.name]: {
        ...prevState[e.target.name],
        value: e.target.value
      }
    }))

    if (e.target.name === "examCode") {
      setSelectRow((prevState) => ({
        ...prevState,
        licenseId: {
          ...prevState.licenseId,
          value: ""
        }
      }))
    }
  }

  const handleSelectFocus = (name) => {
    setSelectRow((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        isError: false
      }
    }))
  }

  return (
    <>
      <BackdropLoad open={loading} />
      <CardWithBreadcrumbs
        helmetTabTitle={"Testing Group"}
        pageTitle={params?.groupId ? "Testing Group" : "New Testing Group"}
        breadcrumbs={[
          {
            path: mainPageLink,
            text: "Dashboard"
          },

          {
            path: LINKS.testingGroup,
            text: "Testing Groups"
          },
          {
            path: null,
            text: params?.groupId ? "Testing Group" : "Add New Group"
          }
        ]}
      >
        <form className={s.form} onSubmit={onSubmitForm}>
          <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="space-between"
          >
            <Grid item>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Typography variant="h5" textAlign="center">
                    {params?.groupId ? "Testing Group" : "Add Testing Group"}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    name="groupName"
                    className={s.textField}
                    value={inputVal.value}
                    onChange={(e) =>
                      setInputVal((prevState) => ({
                        ...prevState,
                        value: e.target.value
                      }))}
                    onFocus={onInputFocus}
                    label="Group Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                  />
                  {inputVal.isError && (
                    <Typography variant={"subtitle2"} color={"error"}>
                      Group Name field id required
                    </Typography>
                  )}
                </Grid>
                {selectRow &&
                  Object.values(selectRow).reduce(
                    (acc, {name, label, options, value, isError}, index) => {
                      let optionsToRender = [...options]
                      if (
                        name === "proctorUserId" &&
                        selectRow["proctoring"].value !== "classroom"
                      )
                        return acc
                      if (
                        name === "licenseId" &&
                        selectRow["paymentType"].value !== "License inventory"
                      )
                        return acc

                      if (
                        name === "paymentType" &&
                        !selectRow["licenseId"].options?.length
                      ) {
                        optionsToRender = optionsToRender.filter(
                          (el) => el.value !== "License inventory"
                        )
                      }
                      if (
                        name === "paymentType" &&
                        selectRow["examCode"].value !== "default" &&
                        selectRow["examCode"].value
                      ) {
                        if (!examHasAvailableVouchers)
                          optionsToRender = optionsToRender.filter(
                            (el) => el.value !== "Voucher inventory"
                          )
                      }
                      if (name === "examCode") {
                        optionsToRender = optionsToRender.map((option) => {
                          return {
                            ...option,
                            label: `${option.label} - ${
                              fromAbbrToWords[option.value]
                            }`
                          }
                        })
                      }
                      if (!options?.length) return acc
                      const selectLabelId = `demo-simple-select-label-${index}`
                      acc.push(
                        <Grid item key={name}>
                          <FormControl
                            className={s.formControl}
                            variant="standard"
                          >
                            <InputLabel id={selectLabelId}>{label}</InputLabel>
                            <Select
                              labelId={selectLabelId}
                              label={label}
                              name={name}
                              value={value ? value : ""}
                              error={isError}
                              onChange={handleChangeSelect}
                              onFocus={() => handleSelectFocus(name)}
                            >
                              {optionsToRender?.length &&
                                optionsToRender.map(({label, value}) => {
                                  return (
                                    <MenuItem key={label} value={value}>
                                      {label}
                                    </MenuItem>
                                  )
                                })}
                            </Select>
                          </FormControl>
                          {isError && (
                            <Typography variant={"subtitle2"} color={"error"}>
                              {label} field is required
                            </Typography>
                          )}
                        </Grid>
                      )
                      return acc
                    },
                    []
                  )}
              </Grid>
            </Grid>
            <Grid item display="flex" justifyContent="flex-end">
              
              <Grid display="flex" gap={2}>
                <Button
                  color="error"
                  type="submit"
                  variant="contained"
                  onClick={() => setCancel(true)}
                >
                  Cancel
                </Button>
                
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={submitDisabled}
                >
                  {params?.groupId ? "Save Testing Group" : "Add Testing Group"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardWithBreadcrumbs>
    </>
  )
}
