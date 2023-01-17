import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  Box,
  Button,
  FormControl, IconButton,
  Link,
  MenuItem,
  TextField, Theme,
  Typography
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import DownloadCSV from "./components/DownloadCSV"
import {INewStudent} from "components/ManageStudentList"
import React, {useState} from "react"
import {useCSVReader} from "react-papaparse"
import {Link as RouterLink} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import CustomErrorClass from "store/slices/notifier/customErrorClass"
import {customErrors} from "store/slices/notifier/errorObject"
import {handleError, notifyUser} from "store/slices/notifier/notifier"
import {batchNewStudentsThunk, fetchSchoolStudentsThunk} from "store/slices/schoolSlice/schoolSlice"
import {IClassroomItem} from "types/common"

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    minWidth: "500px",
    [theme.breakpoints.down(undefined)]: {
      width: "95%",
      minWidth: "0"
    }
  },
  fileInput: {
    height: "30px",
    padding: "10px",
    background: "white",
    border: "none",
    fontSize: "13px",
    color: "#172b4d"
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
  }
}))

interface Props {
  classroom?: IClassroomItem
  classrooms?: IClassroomItem[]
  onAfterSubmit: () => void
  backHandler?: () => void
}

export default function AddMultipleStudentsForm({
  classroom,
  classrooms,
  onAfterSubmit,
  backHandler
}: Props) {
  const s = useStyles()

  const dispatch = useDispatch()

  const {CSVReader} = useCSVReader()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const [selectedClassroom, setSelectedClassroom] = useState(classroom?._id || classrooms[0]?._id || "")
  const [file, setFile] = useState<any[] | null>(null)

  const handleSubmit = () => {
    if (!file?.length) {
      dispatch(handleError(new CustomErrorClass(customErrors.CANT_UPLOAD_FILE)))
    } else {
      const errors = []

      const students = file?.reduce((acc, i) => {
        const data: INewStudent = {
          email: `${i["Email"] || ""}`,
          firstName: `${i["First Name"] || ""}`,
          lastName: `${i["Last Name"] || ""}`,
          password: `${i["Password"] || ""}`,
          studentId: `${i["Student ID"] || ""}`,
          schoolId: `${i["schoolId"] || schoolId || ""}`
        }

        if (!data) {
          errors.push("User row can not be empty")
          return acc
        } else if (!data.firstName) {
          errors.push("First Name field can not be empty")
          return acc
        } else if (!data.lastName) {
          errors.push("Last Name field can not be empty")
          return acc
        } else if (!data.password) {
          errors.push("Password field can not be empty")
          return acc
        } else if (!data.schoolId) {
          errors.push("Can't find school ID")
          return acc
        }

        acc.push(data)

        return acc
      }, [])

      if (!students?.length) {
        dispatch(handleError(new CustomErrorClass(customErrors.CANT_UPLOAD_FILE)))
      } else if (errors?.length) {
        errors.forEach((message) => {
          dispatch(notifyUser({
            message: message,
            variant: "error",
            duration: 5000
          }))
        })
      } else {
        dispatch(batchNewStudentsThunk({
          students,
          classroomId: selectedClassroom
        })).then(() => {
          dispatch(fetchSchoolStudentsThunk(schoolId))
        })

        onAfterSubmit()
      }
    }
  }

  return (
    <Box className={s.form}>
      <CSVReader
        config={{header: true, skipEmptyLines: true}}
        onUploadAccepted={({data}) => {
          setFile(data)
        }}>
        {({getRootProps, acceptedFile}) => (
          <>
            <Box pt={3} px={4}>
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
                    Create Multiple Accounts With Bulk Upload
                  </Typography>
                </Box>
                <Box width={!!backHandler ? 40 : 0}/>
              </Box>
              {!classroom && (
                <>
                  <Typography mb={1}>
                    Select classroom
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      select
                      label="Classroom"
                      name="classroom"
                      value={selectedClassroom}
                      onChange={e => {
                        setSelectedClassroom(e.target.value)
                      }}>
                      {classrooms.map(i => (
                        <MenuItem key={i._id} value={i._id}>
                          {i.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                  <Typography variant="body2" textAlign="end" p={1}>
                    <Link to="/classrooms" component={RouterLink} underline="always">
                      Create new classroom
                    </Link>
                  </Typography>
                </>
              )}
              <Box>
                <Typography mb={1}>
                  Upload CSV file for bulk upload
                </Typography>
                <Typography mb={1}>
                  Download a <DownloadCSV label="sample CSV template"/> to see
                  an example of the format required.
                </Typography>
                <Box display="grid" gridTemplateColumns="auto 1fr">
                  <Button className={s.fileButton} {...getRootProps()}>
                    Choose file
                  </Button>
                  <input
                    className={s.fileInput}
                    value={acceptedFile?.name || "No file chosen"}
                    disabled
                  />
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                variant="contained"
                sx={{px: 4}}
                disabled={!acceptedFile || !selectedClassroom}
                onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </>
        )}
      </CSVReader>
    </Box>
  )
}
