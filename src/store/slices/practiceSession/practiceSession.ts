import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import PracticeSessionService from "services/practiceSession.service/practiceSession.service"
import {CreateSessionBodyI} from "./practiceSession.t"
import {errorCase, pendingCase} from "store/storeHelpers"
import {handleError} from "../notifier/notifier"
import {
  IMultSessionWithBody,
  TMultSessionArgs
} from "services/practiceSession.service/practiceSession.service.t"

export const initialState = {
  loading: false,
  hasErrors: false,
  errorMessage: null,
  currentSession: null,
  currentTask: null,
  objectives: null,
  tasksAnswers: null,
  sessionTasksStatus: null,
  allSessions: null,
  examResults: null,
  practiceResultsBySchool: null
}

export const createNewSession = createAsyncThunk(
  "practiceSession/createNewSession",
  async (options: CreateSessionBodyI, thunkAPI) => {
    try {
      return await PracticeSessionService.createNewSession(options)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const getObjectives = createAsyncThunk(
  "practiceSession/getObjectives",
  async (examCategory: string, thunkAPI) => {
    try {
      return await PracticeSessionService.getObjectives(examCategory)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const getSessionInstanceWPThunk = createAsyncThunk(
  "practiceSession/getSessionInstanceWPThunk",
  async (sessionId: string, thunkAPI) => {
    try {
      return await PracticeSessionService.getSessionInstanceWP(sessionId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchSessionsBySchoolThunk = createAsyncThunk(
  "practiceSession/fetchSessionsBySchoolThunk",
  async (
    args: {
      schoolId: string
      examCode?: string
      groupId?: string
      classroomId?: string
      startDate?: number
      endDate?: number
      isPassed?: boolean
    },
    thunkAPI
  ) => {
    try {
      return await PracticeSessionService.fetchSessionsBySchool(args)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchTask = createAsyncThunk(
  "practiceSession/fetchTask",
  async ({sessionId, taskId}: TMultSessionArgs, thunkAPI) => {
    try {
      return await PracticeSessionService.fetchTask({sessionId, taskId})
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)
export const startSessionExam = createAsyncThunk(
  "practiceSession/startSessionExam",
  async (sessionId: string, thunkAPI) => {
    try {
      return await PracticeSessionService.startSessionExam(sessionId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)
export const finishSessionExam = createAsyncThunk(
  "practiceSession/finishSessionExam",
  async (sessionId: string, thunkAPI) => {
    try {
      await PracticeSessionService.finishSessionExam(sessionId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const submitPracticeTask = createAsyncThunk(
  "practiceSession/submitPracticeTask",
  async ({sessionId, taskId, body}: IMultSessionWithBody, thunkAPI) => {
    try {
      return (await PracticeSessionService.submitPracticeTask({
        sessionId,
        taskId,
        body
      })) as Promise<{ correctAnswer: any, validated: boolean }> | unknown
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchSessionExamDetails = createAsyncThunk(
  "practiceSession/fetchSessionExamDetails",
  async (sessionId: string, thunkAPI) => {
    try {
      return await PracticeSessionService.fetchSessionExamDetails(sessionId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const addFlaggedTaskThunk = createAsyncThunk(
  "practiceSession/addFlaggedTaskThunk",
  async ({sessionId, taskId}: TMultSessionArgs, thunkAPI) => {
    try {
      return await PracticeSessionService.addFlaggedTask({sessionId, taskId})
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const removeFlaggedTaskThunk = createAsyncThunk(
  "practiceSession/removeFlaggedTaskThunk",
  async ({sessionId, taskId}: TMultSessionArgs, thunkAPI) => {
    try {
      return await PracticeSessionService.removeFlaggedTask({
        sessionId,
        taskId
      })
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const getTasksAnswers = createAsyncThunk(
  "practiceSession/getTasksAnswers",
  async (sessionId: string, thunkAPI) => {
    try {
      return await PracticeSessionService.getTasksAnswers(sessionId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const getSessionTasksStatus = createAsyncThunk(
  "practiceSession/getSessionTasksStatus",
  async (sessionId: string, thunkAPI) => {
    try {
      return await PracticeSessionService.getSessionTasksStatus(sessionId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchAllSessionsThunk = createAsyncThunk(
  "practiceSession/getAllSessionsThunk",
  async (_: undefined, thunkAPI) => {
    try {
      return await PracticeSessionService.getAllSessions()
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchPracticeSessionsBySchoolThunk = createAsyncThunk(
  "practiceSession/fetchPracticeSessionsBySchoolThunk",
  async (schoolId: string, thunkAPI) => {
    try {
      return await PracticeSessionService.getPracticeSessionsBySchool(schoolId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

const practiceSessionSlice = createSlice({
  name: "practiceSession",
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload
    },
    resetSessionInfo: (state) => {
      state.currentSession = null
      state.currentTask = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, pendingCase)
      .addCase(getObjectives.pending, pendingCase)
      .addCase(createNewSession.pending, pendingCase)
      .addCase(finishSessionExam.pending, pendingCase)
      .addCase(startSessionExam.pending, pendingCase)
      .addCase(submitPracticeTask.pending, pendingCase)
      .addCase(fetchSessionExamDetails.pending, pendingCase)
      .addCase(addFlaggedTaskThunk.pending, pendingCase)
      .addCase(removeFlaggedTaskThunk.pending, pendingCase)
      .addCase(fetchAllSessionsThunk.pending, pendingCase)
      .addCase(fetchSessionsBySchoolThunk.pending, pendingCase)
      .addCase(getSessionInstanceWPThunk.pending, pendingCase)
      .addCase(fetchPracticeSessionsBySchoolThunk.pending, pendingCase)
      .addCase(getTasksAnswers.pending, pendingCase)
      .addCase(getSessionTasksStatus.pending, pendingCase)

    builder
      .addCase(fetchTask.rejected, errorCase)
      .addCase(getObjectives.rejected, errorCase)
      .addCase(createNewSession.rejected, errorCase)
      .addCase(finishSessionExam.rejected, errorCase)
      .addCase(startSessionExam.rejected, errorCase)
      .addCase(submitPracticeTask.rejected, errorCase)
      .addCase(fetchSessionExamDetails.rejected, errorCase)
      .addCase(addFlaggedTaskThunk.rejected, errorCase)
      .addCase(removeFlaggedTaskThunk.rejected, errorCase)
      .addCase(fetchAllSessionsThunk.rejected, errorCase)
      .addCase(fetchSessionsBySchoolThunk.rejected, errorCase)
      .addCase(getSessionInstanceWPThunk.rejected, errorCase)
      .addCase(fetchPracticeSessionsBySchoolThunk.rejected, errorCase)
      .addCase(getTasksAnswers.rejected, errorCase)
      .addCase(getSessionTasksStatus.rejected, errorCase)

    builder
      .addCase(createNewSession.fulfilled, (state, action) => {
        state.loading = false
        state.currentSession = action.payload
      })
      .addCase(getObjectives.fulfilled, (state, action) => {
        state.loading = false
        state.objectives = action.payload
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false
        state.currentTask = action.payload
      })
      .addCase(submitPracticeTask.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentSession?.options?.showResult !== "task") return

        const p = action.payload as { correctAnswer: any, validated: boolean }
        state.currentTask = {
          ...JSON.parse(JSON.stringify(state.currentTask)),
          correctAnswer: p.correctAnswer,
          validated: p.validated
        }
      })
      .addCase(startSessionExam.fulfilled, (state, action) => {
        state.currentSession = action.payload
        state.loading = false
      })
      .addCase(finishSessionExam.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchSessionExamDetails.fulfilled, (state, action) => {
        state.loading = false
        state.currentSession = action.payload
      })
      .addCase(addFlaggedTaskThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(removeFlaggedTaskThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getTasksAnswers.fulfilled, (state, action) => {
        state.loading = false
        state.tasksAnswers = action.payload.data
      })
      .addCase(getSessionTasksStatus.fulfilled, (state, action) => {
        state.loading = false
        state.sessionTasksStatus = action.payload.data
      })
      .addCase(fetchSessionsBySchoolThunk.fulfilled, (state, {payload}) => {
        state.loading = false
        state.examResults = payload?.data || null
      })
      .addCase(getSessionInstanceWPThunk.fulfilled, (state, {payload}) => {
        state.loading = false
        if (payload?.status === "pending") return
        if (state.currentSession) {
          state.currentSession.instance = payload
          return
        }
        state.currentSession = {
          instance: payload
        }
      })
      .addCase(
        fetchPracticeSessionsBySchoolThunk.fulfilled,
        (state, {payload}) => {
          state.loading = false
          state.practiceResultsBySchool = payload?.data?.length
            ? payload.data
            : null
        }
      )
      .addCase(fetchAllSessionsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.allSessions = action.payload?.length
          ? action.payload.reverse()
          : []
      })
  }
})

export const {reset: resetPracticeSessionSlice, resetSessionInfo} = practiceSessionSlice.actions

export default practiceSessionSlice.reducer
