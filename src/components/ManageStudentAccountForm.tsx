import {useMutation} from "@apollo/client"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  TextField,
  Typography
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {UPDATE_USER_BY_ID} from "api/apollo/mutations"
import ConfirmationAlert from "components/ConfirmationAlert"
import CustomModal from "components/CustomModal"
import TransferStudentForm from "components/TransferStudentForm"
import {passwordValidationRegex} from "consts/regex"
import {Formik} from "formik"
import {INewStudent} from "components/ManageStudentList"
import {
  UpdateUserByIdMutation,
  UpdateUserByIdMutationVariables
} from "generated/graphql"
import React, {useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "store"
import {
  fetchSchoolStudentsThunk,
  fetchStudentsForClassThunk,
  updateStudentInClassThunk,
  updateStudentPassThunk
} from "store/slices/schoolSlice/schoolSlice"
import {IClassroomItem, IStudentItem} from "types/common"
import * as Yup from "yup"
import {useCSVReader} from "react-papaparse"
import {usePickerState} from "@mui/x-date-pickers/internals"


const useStyles = makeStyles(() => ({
  listItemCheckbox: {
    "&:hover": {
      backgroundColor: "white"
    },
    height: "35px",
    cursor: "auto"

  },
  listItemCheckbox2: {
    // "&:hover": {
    //   backgroundColor: "white"
    // }
    height: "37px"
  },
  fileButton: {
    height: "30px",
    background: "#eaeaea",
    border: "none",
    padding: "5px 12px",
    fontWeight: "600",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "15px"
  },
  fileInput: {
    height: "30px",
    padding: "10px",
    background: "white",
    border: "none",
    fontSize: "13px",
    color: "#172b4d"
  }
}))

interface Props {
  classrooms?: IClassroomItem[]
  classroom?: IClassroomItem
  student: IStudentItem
  onAfterSubmit: () => void
  backHandler?: () => void
}

export default function ManageStudentAccountForm({
  classrooms,
  classroom,
  student: studentProp,
  onAfterSubmit,
  backHandler
}: Props) {
  const dispatch = useDispatch()
  const {CSVReader} = useCSVReader()

  const {listItemCheckbox, listItemCheckbox2, fileButton, fileInput} = useStyles()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const loading = useSelector((store) => store.schoolSlice.loading)

  const [showUnenrollPopup, setShowUnenrollPopup] = useState(false)
  const [showConfirmationEmialPopup, setShowConfirmationEmialPopup] = useState(false)
  const [activeClassrooms, setActiveClassrooms] = useState([])
  const [radioGroupSelected, setRadioGroupSelected] = useState("no")
  const [file, setFile] = useState<any[] | null>(null)
  const [confirmationEmial, setConfirmationEmial] = useState("")

  const [updateUserById] = useMutation<
    UpdateUserByIdMutation,
    UpdateUserByIdMutationVariables
  >(UPDATE_USER_BY_ID)

  const student = useMemo(() => studentProp, [])

  const formInitialValues = useMemo(() => {
    return {
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      password: "",
      reason: ""
    }
  }, [student])

  const infoFields = useMemo(() => {
    return [
      {
        label: "First Name",
        fieldName: "firstName",
        type: "text"
      },
      {
        label: "Last Name",
        fieldName: "lastName",
        type: "text"
      }
    ]
  }, [student])

  const passwordFields = useMemo(() => {
    return [
      {
        label: "Password",
        fieldName: "password",
        type: "password"
      },
      {
        label: "Repeat Password",
        fieldName: "repeatPass",
        type: "password"
      }
    ]
  }, [student])

  useEffect(() => {
    setActiveClassrooms(avtiveClassroomsDefault())
  }, [classrooms])

  function avtiveClassroomsDefault(){
    function checkClassroom(_id) {
      return student?.classroomIds.find((item) => item === _id)
    }
    let newArray = classrooms
      .filter((item) => !item.isArchived)
      .map((item) => ({...item, selected: !!checkClassroom(item._id)}))
    return newArray
  }

  let textSelectedClassroomsModal = useMemo(() => {
    let a = avtiveClassroomsDefault().filter(a => a.selected)
    let b = activeClassrooms.filter(a => a.selected)
    let removedClassrooms = []
    let addedClassrooms = []

    a.forEach((item) => {
      if(!b.find(a => a._id === item._id)){
        removedClassrooms.push(item.name)
      }
    })
    b.forEach((item) => {
      if(!a.find(a => a._id === item._id)){
        addedClassrooms.push(item.name)
      }
    })

    function namesList(names) {
      return names.reduce((aggr, name, i) => {
        return aggr += i !== names.length - 1 ? name + ", " : name
       }, "")
    }

    let removedNames = namesList(removedClassrooms)
    let addedNames = namesList(addedClassrooms)
    let message = "Are you sure you want to "

    if(removedClassrooms.length){
      message += `unenroll ${student.firstName} from ` + removedNames
      message += addedClassrooms.length ? " and " : " "
    }
    if(addedClassrooms.length){
      message += `enroll ${!removedClassrooms.length ? student.firstName + " " : ""}to ` + addedNames
    }  
    return message

  }, [activeClassrooms])


  const handleSubmit = (data: typeof formInitialValues) => {
    if (!data || !Object.values(data)?.length) return

    const input: INewStudent = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (!value || key === "repeatPass") {
          return acc
        } else {
          acc[key] = value

          return acc
        }
      },
      {}
    ) as INewStudent
    setShowConfirmationEmialPopup(true)
    console.log(input)
    return
    const {password, ...values} = input

    if (!!password) {
      dispatch(
        updateStudentPassThunk({
          studentId: student.id,
          password
        })
      )
    }

    updateUserById({
      variables: {
        userId: student._id,
        userPayload: values
      }
    }).then(() => {
      dispatch(fetchSchoolStudentsThunk(schoolId))
      if(classroom) {
        dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
      }
      onAfterSubmit()
    })
  }

  const handleUnenroll = async (id: string) => {
    await dispatch(
      updateStudentInClassThunk({
        studentId: id,
        classroomId: classroom?._id || student.classroomIds[0],
        action: "REMOVE"
      })
    )

    dispatch(fetchSchoolStudentsThunk(schoolId))
    dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
  }

  const selectClassroom = (index) => {
    let cloneClassrooms = [...activeClassrooms]
    cloneClassrooms[index].selected = !cloneClassrooms[index].selected
    setActiveClassrooms(cloneClassrooms)
  }

  // const deleteSession = () => {
  //   if (!data.value) {
  //     setData({...data, error: "Reason is required"})
  //   } else {
  //     // handleCancelSessionClick(restartSession._id)
  //     onCloseModal()
  //   }
  // }

  // const onCloseModal = () => {
  //   // setRestartSessionModalOpen(false)
  //   setData({})
  // }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        password: Yup.string()
          .nullable()
          .min(6, "Minimal length is 6 characters")
          .max(35, "Maximum length is 35 characters")
          .matches(
            passwordValidationRegex,
            "Password must contain at least 1 number and one uppercase letter"
          ),
        repeatPass: Yup.string().test(
          null,
          "This field must be the same as \"Password field\"",
          function (val) {
            const passVal = this.parent.password

            if (passVal && !val) return false

            return passVal === val
          }
        ),
        reason: Yup.string().test(
          null,
          "Reason is required",
          (val) => {
            return (radioGroupSelected === "yes" && !val) ? false : true
          }
        )
      })}       
      onSubmit={handleSubmit}
    >
      {({
        errors,
        values,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit}>
          <Box py={3} px={4} minWidth="40vw">
            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box>
                  {!!backHandler && (
                    <IconButton color="secondary" onClick={backHandler}>
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                </Box>
                <Box px={2}>
                  <Typography variant="h5" textAlign="center">
                    Manage Student Account
                  </Typography>
                </Box>
                <Box width={!!backHandler ? 40 : 0} />
              </Box>
              <Box>
                <Typography variant="h6" mb={2}>
                  Student Details
                </Typography>
                <Grid container spacing={3} direction="row" maxWidth="860px">
                  {infoFields.map(({label, fieldName, type}) => (
                    <Grid item xs={6} key={label}>
                      <TextField
                        name={fieldName}
                        value={values[fieldName] || ""}
                        error={!!(touched[fieldName] && errors[fieldName])}
                        helperText={touched[fieldName] && errors[fieldName]}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={label}
                        type={type}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box mt={4}>
                <Typography variant="h6" mb={2}>
                  Update Password
                </Typography>
                <Grid container spacing={3} direction="row" maxWidth="860px">
                  {passwordFields.map(({label, fieldName, type}) => (
                    <Grid item xs={6} key={label}>
                      <TextField
                        name={fieldName}
                        value={values[fieldName] || ""}
                        error={!!(touched[fieldName] && errors[fieldName])}
                        helperText={touched[fieldName] && errors[fieldName]}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label={label}
                        type={type}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box mt={4} mb={3}>
                <Grid mb={1.5}>
                  <Typography variant="h6" mb={1}>
                    Extended session time
                  </Typography>
                  <RadioGroup
                    sx={{columnGap: 1}}
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={radioGroupSelected}
                    name="radio-buttons-group"
                    row
                    onChange={(e) => setRadioGroupSelected(e.target.value)}
                  >
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={6} sx={{
                  transition: "0.5s",
                  maxHeight: radioGroupSelected === "yes" ? "500px" : "0px",
                  opacity: radioGroupSelected === "yes" ? "1" : "0"
                }}>
                  <TextField
                    type="text"
                    variant="outlined"
                    label="Reason"
                    name="reason"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.reason}
                    error={!!(touched.reason && errors.reason)}
                    helperText={touched.reason && errors.reason}
                    multiline
                    rows={3}
                    fullWidth
                  />
                  <CSVReader
                    config={{header: true, skipEmptyLines: true}}
                    onUploadAccepted={(e) => {
                      console.log(e)
                    }}>
                    {({getRootProps, acceptedFile}) => (
                      <Box pt={2}>
                        <Box display="grid" gridTemplateColumns="auto 1fr">
                          <Button className={fileButton} {...getRootProps()}>
                            Choose file
                          </Button>
                          <input
                            className={fileInput}
                            value={acceptedFile?.name || "No file chosen"}
                            disabled
                          />
                        </Box>
                      </Box>
                    )}
                  </CSVReader>
                </Grid>
                
                <Grid
                  sx={{
                    transition: "0.5s",
                    maxHeight: radioGroupSelected === "no" ? "500px" : "0px",
                    opacity: radioGroupSelected === "no" ? "1" : "0"
                  }}
                >
                  <Box 
                    sx={{
                      border: "1px solid silver",
                      borderRadius: "12px",
                      padding: "10px"
                  }}>
                    <Typography display="flex">
                      <Typography fontWeight={500}>
                        Requested by:&nbsp;
                      </Typography>
                      {"<teacher name>"}
                    </Typography>
                    <Typography display="flex">
                      <Typography fontWeight={500}>
                        Date:&nbsp;
                      </Typography>
                      {"<date>"}
                    </Typography>
                    <Typography display="flex">
                      <Typography fontWeight={500}>
                        File:&nbsp;
                      </Typography>
                      {"<link to file>"}
                    </Typography>
                    <Typography display="flex">
                      <Typography fontWeight={500}>
                        Reason:&nbsp;
                      </Typography>
                      {"<reason>"}
                    </Typography>
                  </Box>
                  <Button 
                    sx={{mt: 1}}
                    variant="outlined" 
                    color="error" 
                  >Remove request</Button>
                </Grid>
              </Box>

              <Box mt={4}>
                <Typography variant="h6" mb={2}>
                  Classrooms
                </Typography>
                <List dense sx={{width: "100%", padding: "0"}}>
                  {activeClassrooms.map((value, i) => {
                    const labelId = `checkbox-list-secondary-label-${value._id}`
                    return (
                      <ListItem
                        key={value._id}
                        disableGutters
                        className={listItemCheckbox2}
                      >
                        <Checkbox
                          edge="start"
                          checked={value.selected}
                          tabIndex={-1}
                          // disableRipple
                          inputProps={{"aria-labelledby": labelId}}
                          onClick={() => selectClassroom(i)}
                        />
                        <ListItemText id={labelId} primary={value.name} />
                      </ListItem>
                    )
                  })}
                </List>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={6} mb={1} gap={1}>
              {!classroom && (
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() => alert("hello")}
                >
                  Unenroll from school
                </Button>
              )}
              {/* {!!classroom && (
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() => setShowTransferPopup(true)}
                >
                  Transfer
                </Button>
              )} */}
              {!!classroom && (
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() => setShowUnenrollPopup(true)}
                >
                  Unenroll
                </Button>
              )}
              <Button type="submit" variant="contained" disabled={loading}>
                Save
              </Button>
            </Box>
            {/* <CustomModal
              open={showTransferPopup}
              onClose={() => setShowTransferPopup(false)}
            >
              <TransferStudentForm
                classrooms={classrooms}
                classroom={classroom}
                student={student}
                onAfterSubmit={() => {
                  setShowTransferPopup(false)
                  onAfterSubmit()
                }}
                onCancel={() => setShowTransferPopup(false)}
              />
            </CustomModal> */}
            <CustomModal
              open={showConfirmationEmialPopup}
              onClose={() => setShowConfirmationEmialPopup(false)}
            >
              <Box 
                textAlign="center"
                sx={{
                  maxWidth: 400,
                  boxShadow: 24,
                  p: 4
                }}
              >
                <Typography variant="h6" mb={2}>{textSelectedClassroomsModal}</Typography>
                <TextField
                  name={"Email"}
                  value={confirmationEmial || ""}
                  // error={!!(touched[fieldName] && errors[fieldName])}
                  // helperText={touched[fieldName] && errors[fieldName]}
                  // onBlur={handleBlur}
                  onChange={(e) => setConfirmationEmial(e.target.value)}
                  label={"Email"}
                  type="email"
                  fullWidth
                  variant="outlined"
                />
                <Box mt={2} display="flex" justifyContent="center" columnGap="20px">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowConfirmationEmialPopup(false)}
                    sx={{
                      letterSpacing: "1px"
                    }}
                  >
                    No
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowConfirmationEmialPopup(false)}
                    sx={{
                      letterSpacing: "1px"
                    }}
                  >
                    Yes
                  </Button>
                </Box>
              </Box>
            </CustomModal>
            {!!classroom && (
              <ConfirmationAlert
                isOpen={showUnenrollPopup}
                setOpen={() => setShowUnenrollPopup(false)}
                handleConfirm={() => handleUnenroll(student._id)}
                handleCancel={() => setShowUnenrollPopup(false)}
                dialogTitle={`Are you sure you want to unenroll ${student?.fullName} from the classroom ${classroom?.name}?`}
                cancelText="No"
                confirmText={{color: "error", text: "Yes, unenroll"}}
              />
            )}
          </Box>
        </form>
      )}
    </Formik>
  )
}
