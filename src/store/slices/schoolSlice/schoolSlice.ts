import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {SchoolService} from "services/school.service"
import {handleError, notifyUser} from "../notifier/notifier"
import {errorCase, pendingCase} from "store/storeHelpers"
import {customErrors} from "../notifier/errorObject"
import {INewStudent} from "components/ManageStudentList"
import {
  ILicenseItem,
  IClassroomItem,
  ISchoolItem,
  IStudentItem,
  ITeacherItem,
  ITestingGroupItem
} from "types/common"
import CustomErrorClass from "../notifier/customErrorClass"
import {customNotifications} from "../notifier/notificationObject"
import {
  IFetchClassroomStudentsInput,
  IfetchSchoolClassroomsInput
} from "types/services/school.service.t"

interface ISchoolSliceInitialState {
  loading: boolean
  errorMessage: string
  allSchools: Array<ISchoolItem>
  currentSchool: string
  testingGroups: Array<ITestingGroupItem>
  currentTestingGroup: ITestingGroupItem
  students: Array<IStudentItem>
  currentStudent: IStudentItem
  teachers: Array<ITeacherItem>
  licenses: Array<ILicenseItem>
  licensesByExamCode: Array<ILicenseItem>
  availableClassrooms: Array<IClassroomItem>
  selectedClassStudents: Array<IStudentItem>
}

const initialState: ISchoolSliceInitialState = {
  loading: false,
  errorMessage: "",
  allSchools: [],
  currentSchool: null,
  testingGroups: null,
  currentTestingGroup: null,
  students: null,
  currentStudent: null,
  teachers: null,
  licenses: null,
  licensesByExamCode: null,
  availableClassrooms: [],
  selectedClassStudents: []
}

export const fetchAvailableSchoolsThunk = createAsyncThunk(
  "schoolSlice/fetchAvailableSchoolsThunk",
  async (_, thunkAPI) => {
    try {
      const res = await SchoolService.fetchAvailableSchools()
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchAvailableClassroomsThunk = createAsyncThunk(
  "schoolSlice/fetchAvailableClassroomsThunk",
  async (input: IfetchSchoolClassroomsInput, thunkAPI) => {
    try {
      return await SchoolService.fetchSchoolClassrooms(input)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchStudentsForClassThunk = createAsyncThunk(
  "schoolSlice/fetchStudentsForClassThunk",
  async (input: IFetchClassroomStudentsInput, thunkAPI) => {
    try {
      return await SchoolService.fetchClassroomStudents(input)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchLicensesByExamCodeThunk = createAsyncThunk(
  "schoolSlice/fetchLicensesByExamCodeThunk",
  async (schoolAndExam: { schoolId: string, examCode: string }, thunkAPI) => {
    try {
      return await SchoolService.fetchLicensesByExamCode(schoolAndExam)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchTestingGroupsThunk = createAsyncThunk(
  "schoolSlice/fetchTestingGroupsThunk",
  async ({schoolId, archived}: {schoolId: string, archived?: boolean}, thunkAPI) => {
    try {
      const showArchived = archived || false

      const res = await SchoolService.fetchTestingGroups({
        schoolId,
        showArchived
      })

      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchSchoolTeachersThunk = createAsyncThunk(
  "schoolSlice/fetchSchoolTeachersThunk",
  async (schoolId: string, thunkAPI) => {
    try {
      const res = await SchoolService.fetchSchoolTeachers(schoolId)
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(
        handleError(new CustomErrorClass(customErrors.CAN_NOT_FETCH_TEACHER))
      )
      throw err?.data?.error || err
    }
  }
)

export const fetchLicensesThunk = createAsyncThunk(
  "schoolSlice/fetchLicensesThunk",
  async (schoolId: string, thunkAPI) => {
    try {
      return await SchoolService.fetchLicenses(schoolId)
    } catch (err) {
      thunkAPI.dispatch(
        handleError(new CustomErrorClass(customErrors.CAN_NOT_FETCH_LICENSES))
      )
      throw err?.data?.error || err
    }
  }
)

export const fetchSchoolStudentsThunk = createAsyncThunk(
  "schoolSlice/fetchSchoolStudentsThunk",
  async (schoolId: string, thunkAPI) => {
    try {
      const res = await SchoolService.fetchSchoolStudents(schoolId)
      return res.data
    } catch (err) {
      thunkAPI.dispatch(
        handleError(new CustomErrorClass(customErrors.CAN_NOT_FETCH_STUDENTS))
      )
      throw err?.data?.error || err
    }
  }
)

export const fetchTestingGroupByIdThunk = createAsyncThunk(
  "schoolSlice/fetchTestingGroupByIdThunk",
  async (groupId: string, thunkAPI) => {
    try {
      return await SchoolService.fetchTestingGroupById(groupId)
    } catch (err) {
      thunkAPI.dispatch(
        handleError(
          new CustomErrorClass(customErrors.CAN_NOT_FETCH_TESTING_GROUP)
        )
      )
      throw err?.data?.error || err
    }
  }
)

export const deleteSchoolTeacherThunk = createAsyncThunk(
  "schoolSlice/deleteSchoolTeacherThunk",
  async (
    {schoolId, teacherId}: { schoolId: string, teacherId: string },
    thunkAPI
  ) => {
    try {
      const res = await SchoolService.deleteSchoolTeacher({
        schoolId,
        teacherId
      })
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_DELETE_TEACHER))
      throw err?.data?.error || err
    }
  }
)

export const deleteTestingGroupThunk = createAsyncThunk(
  "schoolSlice/deleteTestingGroup",
  async (groupId: string, thunkAPI) => {
    try {
      const res = await SchoolService.deleteTestingGroup(groupId)
      thunkAPI.dispatch(removeGroupById(groupId))
      thunkAPI.dispatch(notifyUser({message: "GROUP_DELETE_SUCCESS"}))
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_DELETE_GROUP))
      throw err?.data?.error || err
    }
  }
)

export const deleteStudentThunk = createAsyncThunk(
  "schoolSlice/deleteStudentThunk",
  async (studentId: string, thunkAPI) => {
    try {
      const res = await SchoolService.deleteStudent(studentId)
      thunkAPI.dispatch(removeStudentById(studentId))
      thunkAPI.dispatch(
        notifyUser({message: customNotifications.STUDENT_DELETE_SUCCESS})
      )
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_DELETE_STUDENT))
      throw err?.data?.error || err
    }
  }
)

export const deleteClassroomThunk = createAsyncThunk(
  "schoolSlice/deleteClassroomThunk",
  async (classroomId: string, thunkAPI) => {
    try {
      const res = await SchoolService.deleteClassroom(classroomId)
      thunkAPI.dispatch(removeClassroomById(classroomId))
      thunkAPI.dispatch(
        notifyUser({message: customNotifications.CLASS_DELETE_SUCCESS})
      )
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_DELETE_CLASS))
      throw err?.data?.error || err
    }
  }
)

export const createClassThunk = createAsyncThunk(
  "schoolSlice/createNewClassroom",
  async (payload: Parameters<typeof SchoolService.createNewClassroom>[0], thunkAPI) => {
    try {
      const res = await SchoolService.createNewClassroom(payload)

      thunkAPI.dispatch(notifyUser({message: "CREATE_CLASSROOM_SUCCESS"}))

      return res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const createNewStudentThunk = createAsyncThunk(
  "schoolSlice/createNewStudent",
  async (newStudent: INewStudent, thunkAPI) => {
    try {
      const res = await SchoolService.createNewStudent(newStudent)
      thunkAPI.dispatch(notifyUser({message: "STUDENT_ADD_SUCCESS"}))
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const createNewTeacherThunk = createAsyncThunk(
  "schoolSlice/createNewTeacherThunk",
  async (props: { schoolId: string, email: string }, thunkAPI) => {
    try {
      const res = await SchoolService.createNewTeacher(props)
      thunkAPI.dispatch(notifyUser({message: "TEACHER_ADD_SUCCESS"}))
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const createTestingGroupThunk = createAsyncThunk(
  "schoolSlice/createTestingGroupThunk",
  async (testingGroup: any, thunkAPI) => {
    try {
      const res = await SchoolService.createTestingGroup(testingGroup)
      thunkAPI.dispatch(notifyUser({message: "GROUP_ADD_SUCCESS"}))
      return res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const batchNewStudentsThunk = createAsyncThunk(
  "schoolSlice/batchNewStudentsThunk",
  async (data: { students: INewStudent[], classroomId: string }, thunkAPI) => {
    try {
      const {students, classroomId} = data
      // const res = await SchoolService.batchNewStudents(students);
      const res = await SchoolService.batchNewStudentsToClassroom({
        students,
        classroomId
      })
      let isError = false
      res.forEach((el) => {
        if (el.err) {
          isError = true
          let message = ""
          if (el.name) message += el.name
          if (el.err?.message)
            message = message ? `${message} ${el.err.message}` : el.err.message
          if (!message)
            return thunkAPI.dispatch(
              notifyUser({message: "Can not add user.", variant: "error"})
            )
          thunkAPI.dispatch(
            notifyUser({message: message, variant: "error", duration: 6000})
          )
        }
      })
      if (!isError)
        thunkAPI.dispatch(
          notifyUser({message: customNotifications.STUDENT_ADD_SUCCESS})
        )
      return res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateClassroomThunk = createAsyncThunk(
  "schoolSlice/updateClassroom",
  async (payload: { id: string, data: Partial<IClassroomItem> }, thunkAPI) => {
    try {
      const res = await SchoolService.updateClassroom(payload)
      thunkAPI.dispatch(notifyUser({message: "UPDATE_CLASSROOM_SUCCESS"}))
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateStudentPassThunk = createAsyncThunk(
  "schoolSlice/updateStudentPassThunk",
  async (params: { password: string, studentId: string }, thunkAPI) => {
    try {
      const res = await SchoolService.updateStudentPassword(params)
      thunkAPI.dispatch(
        notifyUser({message: "PASSWORD_UPDATE_SUCCESS", variant: "success"})
      )
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateStudentThunk = createAsyncThunk(
  "schoolSlice/updateStudentThunk",
  async (data: Partial<IStudentItem>, thunkAPI) => {
    try {
      const res = await SchoolService.updateStudent(data)
      thunkAPI.dispatch(
        notifyUser({message: "USER_UPDATE_SUCCESS", variant: "success"})
      )
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateTestingGroupThunk = createAsyncThunk(
  "schoolSlice/updateTestingGroupThunk",
  async (group: any, thunkAPI) => {
    try {
      const res = await SchoolService.updateTestingGroup(group)
      thunkAPI.dispatch(
        notifyUser({message: "GROUP_UPDATE_SUCCESS", variant: "success"})
      )
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateTestingGroupStatusThunk = createAsyncThunk(
  "schoolSlice/updateTestingGroupStatusThunk",
  async (args: { id: string, status: string }, thunkAPI) => {
    try {
      const res = await SchoolService.updateTestingGroupStatus(args)
      // thunkAPI.dispatch(
      //   notifyUser({message: "GROUP_UPDATE_SUCCESS", variant: "success"})
      // )
      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateTestingGroupArchiveThunk = createAsyncThunk(
  "schoolSlice/archiveTestingGroup",
  async (
    {groupId, archive}: {groupId: string, archive: boolean},
    thunkAPI
  ) => {
    try {
      const res = await SchoolService.updateTestingGroupArchive({
        groupId,
        archive
      })

      thunkAPI.dispatch(notifyUser({
        message: `GROUP_${archive ? "ARCHIVED" : "UNARCHIVED"}_SUCCESS`
      }))

      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_DELETE_GROUP))
      throw err?.data?.error || err
    }
  }
)

export const updateStudentInClassThunk = createAsyncThunk(
  "schoolSlice/updateStudentInClassThunk",
  async (args: {
    studentId: string
    classroomId: string
    action: "ADD" | "REMOVE"
  }, thunkAPI) => {
    try {
      const res = await SchoolService.updateStudentInClass(args)

      thunkAPI.dispatch(notifyUser({message: "USER_UPDATE_SUCCESS", variant: "success"}))

      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const updateTeacherInClassThunk = createAsyncThunk(
  "schoolSlice/updateTeacherInClassThunk",
  async (
    args: { teacherId: string, classroomId: string, action: "ADD" | "REMOVE" },
    thunkAPI
  ) => {
    try {
      const res = await SchoolService.updateTeacherInClass(args)

      thunkAPI.dispatch(notifyUser({message: "TEACHER_UPDATE_SUCCESS", variant: "success"}))

      return res?.data || res
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

const schoolSlice = createSlice({
  name: "schoolSlice",
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    setCurrentSchool(state, action) {
      state.currentSchool = action.payload === "student" ? null : action.payload
    },
    cleanSpecificSchoolStateField(state, action) {
      if (!action?.payload?.length) return

      action.payload.forEach((fieldName) => {
        state[fieldName] = null
      })
    },
    setCurrentTestingGroup(state, action) {
      state.currentTestingGroup = action.payload
    },
    removeGroupById(state, action) {
      if (!state.testingGroups?.length) return

      state.testingGroups = state.testingGroups.filter(
        (group) => group.id !== action.payload
      )
    },
    removeStudentById(state, action) {
      if (!state.students?.length) return

      state.students = state.students.filter(
        (student) => student.id !== action.payload
      )
    },
    removeClassroomById(state, action) {
      state.availableClassrooms = state.availableClassrooms.filter(
        (classItem) => classItem._id !== action.payload
      )
    },
    setCurrentStudent(state, {payload}) {
      state.currentStudent = payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteStudentThunk.pending, pendingCase)
      .addCase(fetchLicensesThunk.pending, pendingCase)
      .addCase(createClassThunk.pending, pendingCase)
      .addCase(createNewStudentThunk.pending, pendingCase)
      .addCase(updateClassroomThunk.pending, pendingCase)
      .addCase(updateStudentPassThunk.pending, pendingCase)
      .addCase(fetchTestingGroupsThunk.pending, pendingCase)
      .addCase(deleteTestingGroupThunk.pending, pendingCase)
      .addCase(updateTestingGroupThunk.pending, pendingCase)
      .addCase(updateTestingGroupArchiveThunk.pending, pendingCase)
      .addCase(createTestingGroupThunk.pending, pendingCase)
      .addCase(fetchSchoolStudentsThunk.pending, pendingCase)
      .addCase(fetchSchoolTeachersThunk.pending, pendingCase)
      .addCase(deleteSchoolTeacherThunk.pending, pendingCase)
      .addCase(fetchAvailableSchoolsThunk.pending, pendingCase)
      .addCase(fetchAvailableClassroomsThunk.pending, pendingCase)
      .addCase(fetchStudentsForClassThunk.pending, pendingCase)

      .addCase(fetchLicensesByExamCodeThunk.pending, pendingCase)
      .addCase(updateStudentThunk.pending, pendingCase)
      .addCase(updateTestingGroupStatusThunk.pending, pendingCase)
      .addCase(updateStudentInClassThunk.pending, errorCase)
      .addCase(batchNewStudentsThunk.pending, pendingCase)
      .addCase(fetchTestingGroupByIdThunk.pending, pendingCase)

    builder
      .addCase(fetchLicensesThunk.rejected, errorCase)
      .addCase(deleteStudentThunk.rejected, errorCase)
      .addCase(createClassThunk.rejected, errorCase)
      .addCase(createNewStudentThunk.rejected, errorCase)
      .addCase(updateClassroomThunk.rejected, errorCase)
      .addCase(updateStudentPassThunk.rejected, errorCase)
      .addCase(fetchTestingGroupsThunk.rejected, errorCase)
      .addCase(deleteTestingGroupThunk.rejected, errorCase)
      .addCase(updateTestingGroupThunk.rejected, errorCase)
      .addCase(updateTestingGroupArchiveThunk.rejected, errorCase)
      .addCase(updateStudentInClassThunk.rejected, errorCase)
      .addCase(createTestingGroupThunk.rejected, errorCase)
      .addCase(fetchSchoolTeachersThunk.rejected, errorCase)
      .addCase(deleteSchoolTeacherThunk.rejected, errorCase)
      .addCase(fetchSchoolStudentsThunk.rejected, errorCase)
      .addCase(fetchAvailableSchoolsThunk.rejected, errorCase)
      .addCase(fetchAvailableClassroomsThunk.rejected, errorCase)
      .addCase(fetchStudentsForClassThunk.rejected, errorCase)
      .addCase(fetchLicensesByExamCodeThunk.rejected, errorCase)
      .addCase(updateStudentThunk.rejected, errorCase)
      .addCase(updateTestingGroupStatusThunk.rejected, errorCase)
      .addCase(batchNewStudentsThunk.rejected, errorCase)
      .addCase(fetchTestingGroupByIdThunk.rejected, errorCase)

    builder
      .addCase(fetchAvailableSchoolsThunk.fulfilled, (state, action) => {
        state.loading = false
        const selectedAccount = localStorage.getItem("selectedAccount")
        if (selectedAccount && action.payload?.length) {
          const findedSchool = action.payload.find(
            (s) => s.id === selectedAccount
          )
          if (findedSchool) state.currentSchool = findedSchool?.id
        }
        state.allSchools = action.payload
      })
      .addCase(fetchAvailableClassroomsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.availableClassrooms = action.payload
      })
      .addCase(fetchStudentsForClassThunk.fulfilled, (state, action) => {
        state.loading = false
        state.selectedClassStudents = action.payload
      })
      .addCase(fetchTestingGroupsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.testingGroups = action.payload?.length ? action.payload : null
      })
      .addCase(fetchSchoolTeachersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.teachers = action.payload?.length ? action.payload : null
      })
      .addCase(fetchSchoolStudentsThunk.fulfilled, (state, action) => {
        state.students = (action.payload || []).map((st) => {
          let fname = st.firstName || ""
          if (st.lastName) fname += ` ${st.lastName}`
          return {
            ...st,
            fullName: fname
          }
        })
        state.loading = false
      })
      .addCase(fetchTestingGroupByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.currentTestingGroup = action.payload
      })
      .addCase(fetchLicensesByExamCodeThunk.fulfilled, (state, action) => {
        state.loading = false
        state.licensesByExamCode = action.payload
      })
      .addCase(fetchLicensesThunk.fulfilled, (state, action) => {
        state.loading = false
        state.licenses = action.payload
      })

      .addCase(deleteSchoolTeacherThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteTestingGroupThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteStudentThunk.fulfilled, (state) => {
        state.loading = false
      })

      .addCase(updateClassroomThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateTestingGroupThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateTestingGroupArchiveThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateStudentInClassThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateStudentPassThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateStudentThunk.fulfilled, (state, action) => {
        if (!state.students?.length) return
        if (!action.payload) return

        const newStudent = action.payload
        const oldStudents = [...state.students]
        const index = oldStudents.findIndex(
          (student) => student.id === newStudent.id
        )
        if (index === -1) return
        oldStudents[index] = newStudent
        state.students = oldStudents
        state.loading = false
      })
      .addCase(updateTestingGroupStatusThunk.fulfilled, (state, action) => {
        state.loading = false
        state.currentTestingGroup = action.payload
      })

      .addCase(createNewStudentThunk.fulfilled, (state, action) => {
        state.loading = false
        state.students = state.students
          ? [...state.students, action.payload]
          : [action.payload]
      })
      .addCase(batchNewStudentsThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createTestingGroupThunk.fulfilled, (state) => {
        state.loading = false
      })
  }
})

export const {
  reset: resetSchoolSlice,
  setCurrentSchool,
  cleanSpecificSchoolStateField,
  setCurrentTestingGroup,
  removeGroupById,
  removeStudentById,
  removeClassroomById
} = schoolSlice.actions

export default schoolSlice.reducer
