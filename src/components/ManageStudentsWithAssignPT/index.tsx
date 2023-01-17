import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"
import {Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material"
import AddMultipleStudentsForm from "components/AddMultipleStudentsForm"
import AddSingleStudentForm from "components/AddSingleStudentForm"
import AssignPracticeTestForm from "components/AssignPracticeTestForm"
import CustomModal from "components/CustomModal"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import ManageStudentAccountForm from "components/ManageStudentAccountForm"
import fromAbbrToWords from "consts/fromAbbrToWords"
import useSearchInput from "hooks/useSearchInput"
import React, {useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "store"
import {getAvailableExamCodes, getExamCodesHavePracticeSessionsThunk} from "store/slices/exams"
import {notifyUser} from "store/slices/notifier/notifier"
import {assignPracticeTestThunk, getVouchersBySchoolThunk} from "store/slices/practiceVouchers/practiceVouchers"
import {
  fetchAvailableClassroomsThunk,
  fetchLicensesByExamCodeThunk, fetchLicensesThunk,
  fetchSchoolStudentsThunk,
  fetchStudentsForClassThunk
} from "store/slices/schoolSlice/schoolSlice"
import {examCodesHavePracticeSessionsForSelect} from "store/slices/schoolSlice/selectors"
import {ICheckboxStudentItem, IClassroomItem, ILicenseItem, IStudentItem} from "types/common"
import {IAssignPracticeTestBody} from "types/services/vouchers.service.t"
import formatDate from "utils/formatDate"
import InviteForm from "./components/InviteForm"

type AddStudentModal = "OPTIONS" | "INVITE" | "ADD_SINGLE" | "ADD_MULTIPLE"

interface Props {
  noManageAccounts?: boolean
  classroom?: IClassroomItem
  onClassroomChange?: (id: string) => void
  onInvitationUpdate?: () => void
}

export default function ManageStudentsWithAssignPT({
  noManageAccounts,
  classroom,
  onClassroomChange,
  onInvitationUpdate
}: Props) {
  const dispatch = useDispatch()

  const {
    SearchInputJSX: StudentsSearchInputJSX,
    searchInput: studentsSearchInput
  } = useSearchInput("Search Students")

  const loading = useSelector((store) => store.schoolSlice.loading)
  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const classrooms = useSelector((store) => store.schoolSlice.availableClassrooms)
  const examCodes = useSelector((state) => state.examsSlice.availableExamCodes)
  const practiceExamCodes = useSelector(examCodesHavePracticeSessionsForSelect)
  const licensesByExamCode = useSelector<ILicenseItem[]>((state) => {
    return state.schoolSlice.licensesByExamCode || []
  })
  const schoolStudents = useSelector((store) => store.schoolSlice.students)
  const classroomStudents = useSelector((store) => store.schoolSlice.selectedClassStudents)

  const [currentExamCode, setCurrentExamCode] = useState("")
  const [addStudentsModal, setAddStudentsModal] = useState<AddStudentModal | null>(null)
  const [students, setStudents] = useState<ICheckboxStudentItem[]>(() => {
    const list = !classroom ? schoolStudents : classroomStudents

    return (list || []).map(i => ({
      ...i,
      checked: false
    }))
  })
  const [studentsToAssign, setStudentsToAssign] = useState<string[] | null>(null)
  const [studentToManage, setStudentToManage] = useState<typeof schoolStudents[0] | null>(null)

  const filteredStudents = useMemo(() => {
    return students.filter(i => {
      if (!currentExamCode) return true

      return i.vouchers.some(i => i.examCode === currentExamCode)
    })
  }, [students, practiceExamCodes, currentExamCode])

  const selectedStudents = useMemo(() => {
    return filteredStudents.filter(i => i.checked)
  }, [filteredStudents])

  const allStudentsSelected = useMemo(() => {
    return filteredStudents.filter(i => !i.checked).length === 0
  }, [filteredStudents])

  const studentsTableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "checkbox",
      headerText: {
        element: (
          <Checkbox
            color="primary"
            checked={allStudentsSelected}
            onChange={() => {
              setStudents(current => current.map(i => ({
                ...i,
                checked: !allStudentsSelected
              })))
            }}
          />
        )
      },
      fieldToReturn: "asd",
      checkHandler: id => {
        setStudents(current => {
          return current.map(i => {
            if (i._id !== id) return i

            return {
              ...i,
              checked: !i.checked
            }
          })
        })
      }
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
      type: "custom",
      headerText: "Practice tests",
      content: (data: IStudentItem) => {
        return data.vouchers.map(i => {
          const code = practiceExamCodes?.find(code => code.value === i.examCode || code.label === i.examCode)

          return `${code ? code.label : i} - ${formatDate(i.expirationDate)}`
        }).join("\n")
      }
    }, !noManageAccounts && {
      type: "custom",
      headerText: "",
      content: (i: IClassroomItem) => (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => handleSetStudentToManage(i._id)}>
          View More Details
        </Button>
      )
    }].filter(Boolean) as ITableSchema
  }, [filteredStudents, allStudentsSelected])

  useEffect(() => {
    dispatch(fetchAvailableClassroomsThunk({schoolId}))
    dispatch(fetchSchoolStudentsThunk(schoolId))

    if (!!classroom) {
      dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
    }

    dispatch(getAvailableExamCodes())
    dispatch(getExamCodesHavePracticeSessionsThunk(schoolId))
    dispatch(fetchLicensesThunk(schoolId))
    dispatch(getVouchersBySchoolThunk(schoolId))
  }, [schoolId, classroom?._id])

  useEffect(() => {
    const list = !classroom ? schoolStudents : classroomStudents

    setStudents((list || []).map(i => ({
      ...i,
      checked: false
    })))
  }, [schoolStudents, classroomStudents])

  const handleShowAssignTests = () => {
    if (selectedStudents.length === 0) {
      dispatch(notifyUser({
        message: "NO_STUDENTS_CHOSEN",
        variant: "info"
      }))
    } else {
      setStudentsToAssign(selectedStudents.map(i => i.cognitoUserId))
    }
  }

  const handleChangeExamCode = (examCode: string) => {
    dispatch(fetchLicensesByExamCodeThunk({schoolId, examCode}))
  }

  const handleAssignStudents = async (input: {examCode: string, licenseCode?: string}) => {
    const data: IAssignPracticeTestBody = {
      ...input,
      students: [...studentsToAssign]
    }

    setStudentsToAssign(null)

    await dispatch(assignPracticeTestThunk(data))

    dispatch(fetchSchoolStudentsThunk(schoolId))

    if (!!classroom) {
      dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
    }
  }

  const handleSetStudentToManage = (studentId: string) => {
    const student = classroomStudents.find(i => i._id === studentId)

    if (student) {
      setStudentToManage(student)
    }
  }

  return (
    <Box position="relative">
      <Box
        display="flex"
        flexDirection={(!!onClassroomChange || !!classroomStudents.length) ? "row" : "column"}
        alignItems="center"
        justifyContent={(!!onClassroomChange || !!classroomStudents.length) ? "space-between" : "center"}
        mb={(!onClassroomChange || !classroomStudents?.length) ? 4 : 0}>
        <Box>
          {(!!onClassroomChange || !!classroomStudents?.length) ? (
            <Box display="flex" alignItems="center" gap={1}>
              {StudentsSearchInputJSX}
              {!!onClassroomChange && (
                <FormControl sx={{minWidth: 130}} variant="filled">
                  <InputLabel id="select-classroom">Classroom</InputLabel>
                  <Select
                    variant="outlined"
                    labelId="select-classroom"
                    name="classroom"
                    value={classroom?._id || ""}
                    onChange={(e) => {
                      onClassroomChange(e.target.value)
                    }}>
                    {[
                      <MenuItem key="all" value="">
                        <em>All classrooms</em>
                      </MenuItem>,
                      ...(classrooms || []).map(({_id, name}) => {
                        return (
                          <MenuItem key={name} value={_id}>
                            {name}
                          </MenuItem>
                        )
                      })
                    ]}
                  </Select>
                </FormControl>
              )}
              <FormControl sx={{minWidth: 130}} variant="filled">
                <InputLabel id="select-exam-code">Exam Code</InputLabel>
                <Select
                  variant="outlined"
                  labelId="select-exam-code"
                  name="examCode"
                  value={currentExamCode || ""}
                  onChange={(e) => {
                    setCurrentExamCode(e.target.value)
                  }}>
                  {[
                    <MenuItem key="all" value="">
                      <em>All exams</em>
                    </MenuItem>,
                    ...(practiceExamCodes || []).map(({label, value}) => {
                      return (
                        <MenuItem key={label} value={value}>
                          {`${label} - ${fromAbbrToWords[value]}`}
                        </MenuItem>
                      )
                    })
                  ]}
                </Select>
              </FormControl>
            </Box>
          ) : !loading && (
            <Typography color="textPrimary" variant="h6" mb={2}>
              No students found
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {!!students?.length && (
            <Button
              variant="contained"
              onClick={handleShowAssignTests}
              sx={{px: 2.5, py: 1.5}}>
              Assign Practice Tests
            </Button>
          )}
          {!noManageAccounts && (
            <Button
              variant="outlined"
              color="success"
              onClick={() => setAddStudentsModal("OPTIONS")}
              startIcon={<PersonAddAlt1Icon fontSize="medium"/>}
              sx={{px: 2.5, py: 1.5}}>
              Add Students
            </Button>
          )}
        </Box>
      </Box>
      <CustomModal open={!!studentsToAssign} onClose={() => setStudentsToAssign(null)}>
        <AssignPracticeTestForm
          availableExamCodes={examCodes}
          onExamCodeChanged={handleChangeExamCode}
          licensesByExamCode={licensesByExamCode.filter(i => i.productType === "practice test")}
          onFormSubmit={handleAssignStudents}
          checkedStudentsCounter={selectedStudents.length}
        />
      </CustomModal>
      <CustomModal open={addStudentsModal === "OPTIONS"} onClose={() => setAddStudentsModal(null)}>
        <Box px={4} pt={2}>
          <Typography variant="h5" textAlign="center">
            Add New Students to your Classroom
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2} p={4}>
          <Button disabled variant="outlined" fullWidth onClick={() => setAddStudentsModal("INVITE")}>
            Invite Student to your classroom
          </Button>
          <Button variant="outlined" fullWidth onClick={() => setAddStudentsModal("ADD_SINGLE")}>
            Create New Student Account
          </Button>
          <Button variant="outlined" fullWidth onClick={() => setAddStudentsModal("ADD_MULTIPLE")}>
            Create New Student Accounts via bulk upload
          </Button>
        </Box>
      </CustomModal>
      <CustomModal open={addStudentsModal === "INVITE"} onClose={() => setAddStudentsModal(null)}>
        <InviteForm
          classroom={classroom}
          backHandler={() => setAddStudentsModal("OPTIONS")}
          onClose={() => setAddStudentsModal(null)}
          onFinish={() => {
            if (onInvitationUpdate) {
              onInvitationUpdate()
            }
            setAddStudentsModal(null)
          }}
        />
      </CustomModal>
      <CustomModal open={addStudentsModal === "ADD_SINGLE"} onClose={() => setAddStudentsModal(null)}>
        <AddSingleStudentForm
          classroom={classroom}
          onAfterSubmit={() => setAddStudentsModal(null)}
          backHandler={() => setAddStudentsModal("OPTIONS")}
        />
      </CustomModal>
      <CustomModal open={addStudentsModal === "ADD_MULTIPLE"} onClose={() => setAddStudentsModal(null)}>
        <AddMultipleStudentsForm
          classroom={classroom}
          onAfterSubmit={() => setAddStudentsModal(null)}
          backHandler={() => setAddStudentsModal("OPTIONS")}
        />
      </CustomModal>
      <Box mt={1}>
        <CustomSearchTable
          rows={filteredStudents}
          rowsPerPageOption={50}
          tableSchema={studentsTableSchema}
          loading={loading}
          searchFields={["studentId", "username", "firstName", "lastName", "email"]}
          searchInput={studentsSearchInput}
        />
      </Box>
      <CustomModal open={!!studentToManage} onClose={() => setStudentToManage(null)}>
        <ManageStudentAccountForm
          classrooms={classrooms}
          classroom={classroom}
          student={studentToManage}
          onAfterSubmit={() => setStudentToManage(null)}
        />
      </CustomModal>
    </Box>
  )
}
