import {combineReducers} from "@reduxjs/toolkit"

import examsSlice from "./slices/exams"
import resultsSlice from "./slices/results"
import practiceVouchers from "./slices/practiceVouchers/practiceVouchers"
import practiceSession from "./slices/practiceSession/practiceSession"
import notifierSlice from "./slices/notifier/notifier"
import userSlice from "./slices/userSlice/userSlice"
import schoolSlice from "./slices/schoolSlice/schoolSlice"

const combinedReducer = combineReducers({
  examsSlice,
  resultsSlice,
  practiceVouchers,
  practiceSession,
  notifierSlice,
  userSlice,
  schoolSlice
})

const rootReducer: typeof combinedReducer = (state, action) => {
  if (action.type === "userSlice/logoutThunk/fulfilled") {
    state = undefined
  }

  return combinedReducer(state, action)
}

export default rootReducer
