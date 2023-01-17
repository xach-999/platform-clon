import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import ExamService from "services/exam"

export const initialState = {
  loading: false,
  allResults: [],
  hasErrors: false
}

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    getResults: (state) => {
      state.loading = true
    },
    getResultsSucess: (state, {payload}) => {
      state.allResults = payload
      state.loading = false
      state.hasErrors = false
    },
    getResultsFailure: (state) => {
      state.loading = false
      state.hasErrors = true
    }
  }
})

export const {reset: resetResultsSlice, getResults, getResultsSucess, getResultsFailure} = resultsSlice.actions

export default resultsSlice.reducer

export const fetchResults = createAsyncThunk(
  "results/fetchResults",
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(getResults())
    try {
      const res = await ExamService.getUserExamScore()
      thunkAPI.dispatch(getResultsSucess(res.data))
    } catch (error) {
      // Set any erros while trying to fetch
      thunkAPI.dispatch(getResultsFailure())
    }
  }
)
