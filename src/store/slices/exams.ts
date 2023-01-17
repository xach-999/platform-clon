import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {ExamService} from "services/exam.service"
import {handleError, notifyUser} from "./notifier/notifier"
import {errorCase, pendingCase} from "store/storeHelpers"

export const initialState = {
  loading: false,
  cancelingSession: false,
  loadingHasAccess: false,
  hasErrors: false,
  hasAccessErrors: false,
  allExams: null,
  examsByProgramId: [],
  exam: {},
  userExamsScore: null,
  doesStudentHaveAccess: "",
  currentExamDetails: null,
  availableExamCodes: null,
  examCodesHaveSessions: null,
  examCodesHavePracticeSessions: null
}

export const getUserExamsScore = createAsyncThunk(
  "exams/getUserExamsScore",
  async () => {
    const res = await ExamService.getUserExamScore()
    return res.data
  }
)

export const getAvailableExamCodes = createAsyncThunk(
  "exams/getAvailableExamCodes",
  async () => {
    return await ExamService.getAvailableExamCodes()
  }
)
export const getExamCodesHavePracticeSessionsThunk = createAsyncThunk(
  "exams/getExamCodesHavePracticeSessionsThunk",
  async (schoolId: string) => {
    return await ExamService.getExamCodesHavePracticeSessions(schoolId)
  }
)
export const getExamCodesHaveSessionsThunk = createAsyncThunk(
  "exams/getExamCodesHaveSessionsThunk",
  async (schoolId: string) => {
    return await ExamService.getExamCodesHaveSessions(schoolId)
  }
)

export const getExamStudentAccess = createAsyncThunk(
  "exams/getExamStudentAccess",
  async (examCode) => {
    const res = await ExamService.getExamStudentAccess(examCode)
    return res.data
  }
)

export const fetchExamDetailsByIdThunk = createAsyncThunk(
  "exams/fetchExamDetailsByIdThunk",
  async (examId: string, thunkAPI) => {
    try {
      const response = await ExamService.fetchExamDetailsById(examId)
      return response?.data || response
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchExams = createAsyncThunk(
  "exams/fetchExams",
  async (arg, thunkAPI) => {
    // Set loading to true
    thunkAPI.dispatch(getExams())
    try {
      const res = await ExamService.get()
      thunkAPI.dispatch(getExamsSucess(res.data))
    } catch (error) {
      // Set any erros while trying to fetch
      thunkAPI.dispatch(getExamsFailure())
    }
  }
)

export const fetchExamByProgramId = createAsyncThunk(
  "exams/fetchExamByProgramId",
  async (input, thunkAPI) => {
    // Set loading to true
    thunkAPI.dispatch(getExams())
    try {
      const res = await ExamService.getById(input)
      thunkAPI.dispatch(getExamByProgramIdSuccess(res.data))
    } catch (error) {
      // Set any erros while trying to fetch
      thunkAPI.dispatch(getExamsFailure())
    }
  }
)

export const cancelExamSessionThunk = createAsyncThunk(
  "exams/cancelExamSession",
  async (sessionId: string, thunkAPI) => {
    try {
      await ExamService.cancelExamSession(sessionId)

      thunkAPI.dispatch(
        notifyUser({message: "Exam session removed successful"})
      )
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
    }
  }
)

// @ts-ignore
const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    getExams: (state) => {
      state.loading = true
    },
    getExamsSucess: (state, {payload}) => {
      state.allExams = payload || []
      state.loading = false
      state.hasErrors = false
    },
    getExamsFailure: (state) => {
      state.loading = false
      state.hasErrors = true
    },
    getExamByProgramIdSuccess: (state, {payload}) => {
      state.examsByProgramId = payload
      state.loading = false
      state.hasErrors = false
    },
    getExam: (state, {payload}) => {
      state.exam = payload
    },
    clearHaveAccess: (state) => {
      state.doesStudentHaveAccess = ""
      state.loadingHasAccess = false
      state.hasAccessErrors = false
    },
    clearCurrentExamDetails: (state) => {
      state.currentExamDetails = null
    }
  },
  extraReducers: (builder) => {
    // pending
    builder.addCase(
      getUserExamsScore.pending || getExamStudentAccess.pending,
      (state) => {
        state.loading = true
      }
    )
    builder.addCase(getExamCodesHaveSessionsThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getExamStudentAccess.pending, (state) => {
      state.loadingHasAccess = true
    })
    builder.addCase(getAvailableExamCodes.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getExamCodesHavePracticeSessionsThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchExamDetailsByIdThunk.pending, pendingCase)
    builder.addCase(cancelExamSessionThunk.pending, (state) => {
      state.loading = true
      state.cancelingSession = true
    })

    //fulfilled
    builder.addCase(getUserExamsScore.fulfilled, (state, {payload}) => {
      state.userExamsScore = payload
      state.loading = false
      state.hasErrors = false
    })
    builder.addCase(getAvailableExamCodes.fulfilled, (state, {payload}) => {
      state.availableExamCodes = payload
      state.loading = false
      state.hasErrors = false
    })
    builder.addCase(
      getExamCodesHaveSessionsThunk.fulfilled,
      (state, {payload}) => {
        if (payload?.length) state.examCodesHaveSessions = payload
        state.loading = false
        state.hasErrors = false
      }
    )
    builder.addCase(
      getExamCodesHavePracticeSessionsThunk.fulfilled,
      (state, {payload}) => {
        if (payload?.length) state.examCodesHavePracticeSessions = payload
        state.loading = false
        state.hasErrors = false
      }
    )
    builder.addCase(getExamStudentAccess.fulfilled, (state, {payload}) => {
      state.doesStudentHaveAccess = payload.doesStudentHaveAccess
      state.loadingHasAccess = false
      state.hasAccessErrors = false
    })
    builder.addCase(fetchExamDetailsByIdThunk.fulfilled, (state, action) => {
      state.loading = false
      state.currentExamDetails = action.payload?.data || action.payload
    })
    builder.addCase(cancelExamSessionThunk.fulfilled, (state) => {
      state.loading = false
      state.cancelingSession = false
    })
    //rejected
    builder.addCase(getUserExamsScore.rejected, (state) => {
      state.loading = false
      state.hasErrors = true
    })
    builder.addCase(getExamCodesHavePracticeSessionsThunk.rejected, (state) => {
      state.loading = false
      state.hasErrors = true
    })
    builder.addCase(getExamStudentAccess.rejected, (state) => {
      state.loadingHasAccess = false
      state.hasAccessErrors = true
    })
    builder.addCase(fetchExamDetailsByIdThunk.rejected, errorCase)
    builder.addCase(getAvailableExamCodes.rejected, errorCase)
    builder.addCase(getExamCodesHaveSessionsThunk.rejected, errorCase)
    builder.addCase(cancelExamSessionThunk.rejected, errorCase)
  }
})

export const {
  reset: resetExamsSlice,
  getExams,
  getExamsSucess,
  getExamsFailure,
  getExamByProgramIdSuccess,
  getExam,
  clearCurrentExamDetails
} = examsSlice.actions

export default examsSlice.reducer

export const setExam = (id) => (dispatch, getState) => {
  const exams = getState().examsSlice.examsByProgramId
  exams?.forEach((item) => {
    item.id === id && dispatch(getExam(item))
    return
  })
}
