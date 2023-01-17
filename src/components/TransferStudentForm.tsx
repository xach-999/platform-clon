import {useMutation} from "@apollo/client"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel, Link,
  MenuItem,
  Select,
  Typography
} from "@mui/material"
import {MOVE_USER_TO_ANOTHER_CLASSROOM} from "api/apollo/mutations"
import {Formik} from "formik"
import {MoveUserToAnotherClassroomMutation, MutationMoveUserToAnotherClassroomArgs} from "generated/graphql"
import React, {useMemo} from "react"
import {Link as RouterLink} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import {handleError, notifyUser} from "store/slices/notifier/notifier"
import {
  fetchSchoolStudentsThunk,
  fetchStudentsForClassThunk
} from "store/slices/schoolSlice/schoolSlice"
import {IClassroomItem, IStudentItem} from "types/common"
import * as Yup from "yup"

interface Props {
  classrooms: IClassroomItem[]
  classroom?: IClassroomItem
  student: IStudentItem
  onAfterSubmit: () => void
  onCancel: () => void
}

export default function TransferStudentForm({
  classrooms,
  classroom,
  student,
  onAfterSubmit,
  onCancel
}: Props) {
  const dispatch = useDispatch()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const formInitialValues = useMemo(() => {
    return {
      classroom: ""
    }
  }, [])

  const [moveUserToAnotherClassroom] = useMutation<
    MoveUserToAnotherClassroomMutation,
    MutationMoveUserToAnotherClassroomArgs
  >(MOVE_USER_TO_ANOTHER_CLASSROOM)

  const handleSubmit = (data: typeof formInitialValues) => {
    if (!data || !Object.values(data)?.length) return

    moveUserToAnotherClassroom({
      variables: {
        userId: student._id,
        fromClassroom: classroom._id,
        toClassroom: data.classroom
      }
    }).then(() => {
      dispatch(fetchSchoolStudentsThunk(schoolId))
      dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
      dispatch(notifyUser({message: "STUDENT_TRANSFER_SUCCESS"}))
      onAfterSubmit()
    }).catch(err => {
      dispatch(handleError(err))
    })
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={Yup.object().shape({
        classroom: Yup.string().required("Classroom is required")
      })}
      onSubmit={handleSubmit}>
      {({
        errors,
        values,
        touched,
        handleChange,
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit}>
          <Box py={3} px={3} minWidth="30vw">
            <Box>
              <Typography variant="h5" mb={1}>
                Transfer Student
              </Typography>
              <Typography variant="h6" mb={4}>
                Please select the new Classroom
              </Typography>
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
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={4} gap={1}>
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  )
}
