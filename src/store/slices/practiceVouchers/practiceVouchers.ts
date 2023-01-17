import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import VoucherService from "services/vouchers.service/vouchers.service"
import {errorCase, pendingCase} from "store/storeHelpers"
import {handleError, notifyUser} from "../notifier/notifier"
import {customErrors} from "../notifier/errorObject"
import {customNotifications} from "../notifier/notificationObject"
import {IAssignPracticeTestBody} from "types/services/vouchers.service.t"

export const initialState = {
  loading: false,
  hasErrors: false,
  errorMessage: null,
  allVouchers: null,
  currentVoucher: null,
  currentSchoolVouchers: null
}

export const redeemVoucherByCode = createAsyncThunk(
  "practiceVouchers/redeemVoucherByCode",
  async (voucherCode: string, thunkAPI) => {
    try {
      const response = await VoucherService.redeemVoucherByCode(voucherCode)
      thunkAPI.dispatch(
        notifyUser({message: customNotifications.NEW_VOUCHER_ACTIVATED})
      )
      return response?.data || response
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const assignPracticeTestThunk = createAsyncThunk(
  "practiceVouchers/assignPracticeTestThunk",
  async (assignPracticeTestBody: IAssignPracticeTestBody, thunkAPI) => {
    try {
      const response = await VoucherService.assignPracticeTest(assignPracticeTestBody)

      thunkAPI.dispatch(notifyUser({
        message: customNotifications.ASSIGN_PRACTICE_TEST_SUCCESS
      }))

      return response?.data || response
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.ASSIGN_PRACTICE_TEST_FAILED))
      throw err?.data?.error || err
    }
  }
)

export const getAllVouchers = createAsyncThunk(
  "practiceVouchers/getAllVouchers",
  async (arg, thunkAPI) => {
    try {
      return await VoucherService.getAllVouchers()
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_FETCH_ALL_VOUCHERS))
      throw err?.data?.error || err
    }
  }
)

export const getVouchersBySchoolThunk = createAsyncThunk(
  "practiceVouchers/getVouchersBySchoolThunk",
  async (schoolId: string, thunkAPI) => {
    try {
      return await VoucherService.getVouchersBySchool(schoolId)
    } catch (err) {
      thunkAPI.dispatch(handleError(customErrors.CAN_NOT_FETCH_ALL_VOUCHERS))
      throw err?.data?.error || err
    }
  }
)

export const fetchVoucherById = createAsyncThunk(
  "practiceVouchers/fetchVoucherById",
  async (voucherId: string, thunkAPI) => {
    try {
      return await VoucherService.fetchVoucherById(voucherId)
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const validateVoucherThunk = createAsyncThunk(
  "practiceVouchers/validateVoucher",
  async (
    {examCode, voucherCode}: { examCode: string, voucherCode: string },
    thunkAPI
  ) => {
    try {
      const res = await VoucherService.validateVoucher({
        examCode,
        voucherCode
      })
      return res.data
    } catch (err) {
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

const practiceVouchersSlice = createSlice({
  name: "practiceVouchers",
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    removeVoucherError: (state) => {
      state.errorMessage = null
    },
    cleanCurrentVoucher: (state) => {
      state.currentVoucher = null
    },
    setCurrentVoucher: (state, action) => {
      state.currentVoucher = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(redeemVoucherByCode.pending, pendingCase)
      .addCase(getAllVouchers.pending, pendingCase)
      .addCase(validateVoucherThunk.pending, pendingCase)
      .addCase(getVouchersBySchoolThunk.pending, pendingCase)
      .addCase(assignPracticeTestThunk.pending, pendingCase)
      .addCase(fetchVoucherById.pending, pendingCase)

    builder
      .addCase(redeemVoucherByCode.rejected, errorCase)
      .addCase(getAllVouchers.rejected, errorCase)
      .addCase(validateVoucherThunk.rejected, errorCase)
      .addCase(getVouchersBySchoolThunk.rejected, errorCase)
      .addCase(assignPracticeTestThunk.rejected, errorCase)
      .addCase(fetchVoucherById.rejected, errorCase)

    builder
      .addCase(redeemVoucherByCode.fulfilled, (state, action) => {
        state.loading = false
        state.currentVoucher = action.payload
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.loading = false
        state.allVouchers = action.payload || null
      })
      .addCase(fetchVoucherById.fulfilled, (state, action) => {
        state.loading = false
        state.currentVoucher = action.payload || null
      })
      .addCase(getVouchersBySchoolThunk.fulfilled, (state, action) => {
        state.loading = false

        state.currentSchoolVouchers = action.payload || null
      })
      .addCase(assignPracticeTestThunk.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(validateVoucherThunk.fulfilled, (state) => {
        state.loading = false
        state.hasErrors = false
      })
  }
})

export const {reset: resetPracticeVouchersSlice, removeVoucherError, cleanCurrentVoucher, setCurrentVoucher} =
  practiceVouchersSlice.actions

export default practiceVouchersSlice.reducer
