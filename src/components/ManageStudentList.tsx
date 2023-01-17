import VisibilityIcon from "@mui/icons-material/Visibility"
import {
  Box, Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  useTheme
} from "@mui/material"
import Trash from "assets/icons/Trash"
import ConfirmationAlert from "components/ConfirmationAlert"
import CustomModal from "components/CustomModal"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import ManageStudentAccountForm from "components/ManageStudentAccountForm"
import useSearchInput from "hooks/useSearchInput"
import AddMultipleStudentsForm from "components/AddMultipleStudentsForm"
import AddSingleStudentForm from "components/AddSingleStudentForm"
import React, {useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "store"
import {
  deleteStudentThunk,
  fetchAvailableClassroomsThunk,
  fetchSchoolStudentsThunk
} from "store/slices/schoolSlice/schoolSlice"

export interface INewStudent {
  firstName: string
  lastName: string
  email: string
  password: string
  schoolId: string
  studentId: string
}

interface Props {
  classroomId?: string
}

type ModalTypes = "ADD_SINGLE" | "ADD_MULTIPLE" | "MANAGE" | "DELETE"

export default function ManageStudentsList({classroomId}: Props) {
  const theme = useTheme()

  const dispatch = useDispatch()

  const schoolLoading = useSelector((store) => store.schoolSlice.loading)
  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const classrooms = useSelector((store) => store.schoolSlice.availableClassrooms)
  const students = useSelector((store) => store.schoolSlice.students)

  const [currentClassroomId, setCurrentClassroomId] = useState(classroomId || "")
  const [modal, setModal] = useState<ModalTypes | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)

  const {SearchInputJSX, searchInput} = useSearchInput("Search Students")

  const filteredStudents = useMemo(() => {
    return students?.filter(i => {
      if (!!currentClassroomId) {
        return i.classroomIds.includes(currentClassroomId)
      } else {
        return true
      }
    })
  }, [students, currentClassroomId])

  const tableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "text",
      headerText: "Student ID",
      fieldName: "studentId"
    }, {
      type: "text",
      headerText: "First Name",
      fieldName: "firstName"
    }, {
      type: "text",
      headerText: "Last Name",
      fieldName: "lastName"
    }, {
      type: "text",
      headerText: "Email",
      fieldName: "email"
    }, {
      type: "text",
      headerText: "Username",
      fieldName: "username"
    }, {
      type: "actions",
      headerText: "Actions",
      actions: [{
        icon: <VisibilityIcon fontSize="small"/>,
        handler: studentId => {
          handleSelectStudentWith(studentId, () => {
            setModal("MANAGE")
          })
        },
        tooltipText: "View More"
      }, {
        icon: <Trash fontSize="small"/>,
        handler: studentId => {
          handleSelectStudentWith(studentId, () => {
            setModal("DELETE")
          })
        },
        tooltipText: "Delete Student"
      }]
    }]
  }, [students])

  useEffect(() => {
    if (!!schoolId) {
      dispatch(fetchAvailableClassroomsThunk({schoolId}))
      dispatch(fetchSchoolStudentsThunk(schoolId))
    }
  }, [schoolId])

  useEffect(() => {
    if (!!schoolId) {
      dispatch(fetchAvailableClassroomsThunk({schoolId}))
      dispatch(fetchSchoolStudentsThunk(schoolId))
    }
  }, [schoolId])

  const handleSelectStudentWith = (
    studentId: string,
    callback: (student: typeof students[0]) => void
  ) => {
    const student = students.find(i => i.id === studentId)

    if (student) {
      setSelectedStudent(student)
      callback(student)
    }
  }

  const handleCancelModal = () => {
    setModal(null)
    setSelectedStudent(null)
  }

  const handleDelete = () => {
    dispatch(deleteStudentThunk(selectedStudent.id))
    handleCancelModal()
  }

  return (
    <Box minHeight={theme.spacing(32)} mb={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Grid container spacing={1} width="auto">
          <Grid item>
            {SearchInputJSX}
          </Grid>
          {!classroomId && !schoolLoading && classrooms?.length > 0 && (
            <Grid item>
              <FormControl sx={{minWidth: 130}} variant="outlined">
                <TextField
                  select
                  label="Classroom"
                  name="classroom"
                  value={currentClassroomId || ""}
                  onChange={(e) => {
                    setCurrentClassroomId(e.target.value)
                  }}>
                  {[
                    <MenuItem key="all" value="">
                      <em>All classrooms</em>
                    </MenuItem>,
                    ...classrooms?.map((i) => (
                      <MenuItem key={i._id} value={i._id}>
                        {i.name}
                      </MenuItem>
                    ))
                  ]}
                </TextField>
              </FormControl>
            </Grid>
          )}
        </Grid>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setModal("ADD_MULTIPLE")}>
            Create Multiple Accounts
          </Button>
          <CustomModal open={modal === "ADD_MULTIPLE"} onClose={handleCancelModal}>
            <AddMultipleStudentsForm
              classrooms={classrooms}
              onAfterSubmit={handleCancelModal}
            />
          </CustomModal>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setModal("ADD_SINGLE")}>
            Create New Student Account
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <CustomSearchTable
          loading={schoolLoading}
          tableSchema={tableSchema}
          rows={filteredStudents}
          rowsPerPageOption={50}
          searchFields={[
            "firstName",
            "email",
            "lastName",
            "username",
            "studentId"
          ]}
          searchInput={searchInput}
        />
        <ConfirmationAlert
          isOpen={modal === "DELETE" && !!selectedStudent}
          setOpen={handleCancelModal}
          handleConfirm={handleDelete}
          handleCancel={handleCancelModal}
          dialogTitle="Delete Student?"
          dialogContentText="Please confirm you want to delete the student."
          cancelText="Cancel"
          confirmText={{color: "error", text: "Delete student"}}
        />
      </Box>
      <CustomModal open={modal === "ADD_SINGLE"} onClose={handleCancelModal}>
        <AddSingleStudentForm
          classrooms={classrooms}
          onAfterSubmit={handleCancelModal}
        />
      </CustomModal>
      <CustomModal open={modal === "MANAGE"} onClose={handleCancelModal}>
        <ManageStudentAccountForm
          classrooms={classrooms}
          student={selectedStudent}
          onAfterSubmit={handleCancelModal}
        />
      </CustomModal>
    </Box>
  )
}
