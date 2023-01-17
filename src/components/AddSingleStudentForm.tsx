import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid, IconButton,
  InputLabel, Link,
  MenuItem,
  Select, TextField,
  Typography
} from "@mui/material"
import {passwordValidationRegex} from "consts/regex"
import {Formik} from "formik"
import {INewStudent} from "components/ManageStudentList"
import React, {useMemo} from "react"
import {Link as RouterLink} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import {createNewStudentThunk, fetchSchoolStudentsThunk} from "store/slices/schoolSlice/schoolSlice"
import {IClassroomItem} from "types/common"
import * as Yup from "yup"

interface Props {
  classroom?: IClassroomItem
  classrooms?: IClassroomItem[]
  onAfterSubmit: () => void
  backHandler?: () => void
}

export default function AddSingleStudentForm({
  classroom,
  classrooms,
  onAfterSubmit,
  backHandler
}: Props) {
  const dispatch = useDispatch()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const formInitialValues = useMemo(() => {
    return {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      classroom: ""
    }
  }, [])

  const inputToRender = useMemo(() => {
    return [{
      label: "Student ID",
      fieldName: "studentId",
      type: "text"
    }, {
      label: "First Name",
      fieldName: "firstName",
      type: "text"
    }, {
      label: "Last Name",
      fieldName: "lastName",
      type: "text"
    }, {
      label: "Email",
      fieldName: "email",
      type: "text"
    }, {
      label: "Password",
      fieldName: "password",
      type: "password"
    }, {
      label: "Repeat Password",
      fieldName: "repeatPass",
      type: "password"
    }]
  }, [])

  const handleSubmit = (data: typeof formInitialValues) => {
    if (!data || !Object.values(data)?.length) return

    const newStudent: INewStudent = Object.entries(data).reduce((acc, [key, value]) => {
      if (!value || key === "repeatPass") {
        return acc
      } else if (key === "classroom") {
        acc["classroomIds"] = [value]

        return acc
      } else {
        acc[key] = value

        return acc
      }
    }, {}) as INewStudent

    onAfterSubmit()

    dispatch(createNewStudentThunk({
      ...newStudent,
      ...(!!classroom ? {classroomIds: [classroom._id]} : {}),
      schoolId
    })).then(() => {
      dispatch(fetchSchoolStudentsThunk(schoolId))
    })
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        password: Yup.string()
          .min(6, "Minimal length is 6 characters")
          .max(35, "Maximum length is 35 characters")
          .matches(passwordValidationRegex, "Password must contain at least 1 number and one uppercase letter")
          .required("New password password is required"),
        repeatPass: Yup.string().test(null, "This field must be the same as \"Password field\"", function (val) {
          const passVal = this.parent.password
          if (passVal && !val) return false
          return passVal === val
        }),
        classroom: Yup.string().required("Classroom is required")
      })}
      onSubmit={handleSubmit}>
      {({
        errors,
        values,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit}>
          <Box py={3} px={6}>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  {!!backHandler && (
                    <IconButton color="secondary" onClick={backHandler}>
                      <ArrowBackIcon/>
                    </IconButton>
                  )}
                </Box>
                <Box px={2}>
                  <Typography variant="h5" textAlign="center">
                    Add New Student
                  </Typography>
                </Box>
                <Box width={!!backHandler ? 40 : 0}/>
              </Box>
              {!classroom && (
                <>
                  <Typography variant="h6" mb={2}>
                    Select Classroom
                  </Typography>
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel error={!!(touched.classroom && errors.classroom)}>
                          Classroom
                        </InputLabel>
                        <Select
                          name="classroom"
                          labelId="classroom-select-label"
                          id="classroom-select"
                          label="Classroom"
                          error={!!(touched.classroom && errors.classroom)}
                          value={values.classroom || ""}
                          onChange={handleChange}>
                          {classrooms.map((classroom) => (
                            <MenuItem key={classroom._id} value={classroom._id}>
                              {classroom.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {!!(touched.classroom && errors.classroom) && (
                        <FormHelperText error sx={{margin: "3px 14px 0 14px"}}>
                          {touched.classroom && errors.classroom}
                        </FormHelperText>
                      )}
                      <Typography
                        variant="body2"
                        textAlign="end"
                        p={1}
                        pb={0}>
                        <Link to="/classrooms" component={RouterLink} underline="always">
                          Create new classroom
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
              <Typography variant="h6" mb={2}>
                Student Details
              </Typography>
              <Grid container spacing={3} direction="row" maxWidth="860px">
                {inputToRender.map(({label, fieldName, type}) => (
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
            <Box display="flex" justifyContent="flex-end" mt={4} mb={2}>
              <Button type="submit" variant="contained">
                Add Student
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  )
}
