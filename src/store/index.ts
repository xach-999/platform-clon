import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from "react-redux"
import type {TypedUseSelectorHook} from "react-redux"
import type {ThunkAction} from "redux-thunk"
import {configureStore} from "@reduxjs/toolkit"
import type {Action} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"
import thunk from "redux-thunk"

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === "true",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(thunk)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export const useDispatch = () => useReduxDispatch<AppDispatch>()

export default store
