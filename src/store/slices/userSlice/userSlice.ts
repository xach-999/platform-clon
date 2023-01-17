import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {Query} from "generated/graphql"
import {handleError, notifyUser} from "../notifier/notifier"
import authService from "services/auth"
import {errorCase, pendingCase} from "store/storeHelpers"
import {Auth} from "aws-amplify"
import {Group} from "types/access"
import {userService} from "services/user.service"
import {IUserInfo} from "types/common"

type UserGroupVariants = `${Group}`

interface IUserSliceInitialState {
  user: string
  userOrganizationId: string
  userGroups: Array<UserGroupVariants>
  fakeGroup: Array<UserGroupVariants> | null
  loading: boolean
  loadingSigUp: boolean
  errLogin: boolean
  address: any
  id: string
  studentId: null
  schoolId: string
  username: string
  firstName: string
  lastName: string
  email: string
  groups: []
  country: string
  city: string
  postcode: string
  // birthdate: string
  // phone: string
  isProctor: boolean
  proctorSignedAt: string
  photoUrl: string
  classrooms: Query["getUser"]["classrooms"]
  invitations: Query["getPendingInvitations"]
  waitingList: Query["getUser"]["waitingList"]
}

export const initialState: IUserSliceInitialState = {
  // birthdate: null,
  city: null,
  country: null,
  firstName: null,
  groups: [],
  id: null,
  isProctor: false,
  lastName: null,
  // phone: null,
  photoUrl: null,
  postcode: null,
  proctorSignedAt: null,
  schoolId: null,
  studentId: null,
  username: null,
  user: null,
  email: null,
  userOrganizationId: null,
  userGroups: null,
  fakeGroup: null,
  loading: true,
  loadingSigUp: false,
  errLogin: false,
  address: null,
  classrooms: [],
  invitations: [],
  waitingList: []
}

export const getUserInfoThunk = createAsyncThunk(
  "userSlice/getUserInfoThunk",
  async (_, thunkAPI) => {
    try {
      const [cognitoUser, userGroups] = await Promise.allSettled([
        authService.getCurrentUserInfo(),
        authService.getCognitoGroups()
      ])

      if (cognitoUser.status === "rejected") throw cognitoUser.reason
      if (userGroups.status === "rejected") throw userGroups.reason

      const {attributes = null, username = null} = cognitoUser.value
      return {
        userEmail: username,
        username: attributes.given_name,
        address: attributes.address,
        userOrganizationId: attributes["custom:organizationId"],
        userGroups: userGroups.value
      }
    } catch (err) {
      console.log(err)
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const fetchUserDetailsThunk = createAsyncThunk(
  "userSlice/fetchUserDetailsThunk",
  async (_, thunkAPI) => {
    try {
      return await userService.fetchUserInfo()
    } catch (err) {
      console.log(err)
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const registerAsProctorThunk = createAsyncThunk(
  "userSlice/registerAsProctorThunk",
  async (_, thunkAPI) => {
    try {
      const res = await userService.registerAsAProctor()

      thunkAPI.dispatch(
        notifyUser({
          message: "PROCTOR_REGISTRATION_SUCCESS"
        })
      )

      return res
    } catch (err) {
      console.log(err)
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

export const logoutThunk = createAsyncThunk(
  "userSlice/logoutThunk",
  async (_, thunkAPI) => {
    try {
      await Auth.signOut()
    } catch (e) {
      return console.error(e.message)
    }
  }
)
export const authAsProctorThunk = createAsyncThunk(
  "userSlice/authAsProctorThunk",
  async (
    proctorCredentials: { username: string, password: string },
    thunkAPI
  ) => {
    try {
      await authService.authAsProctor(proctorCredentials)
    } catch (err) {
      console.log(err)
      thunkAPI.dispatch(handleError(err))
      throw err?.data?.error || err
    }
  }
)

// ! Slice
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setFakeGroup(state, {payload}) {
      if (payload === null) {
        state.fakeGroup = payload
        return
      }
      if (Array.isArray(payload)) {
        state.fakeGroup = payload
        return
      }
      if (state.fakeGroup?.length > 1) {
        const setGroup = new Set(...state.fakeGroup)
        state.fakeGroup = [...setGroup, payload]
        return
      }
      state.fakeGroup = [payload]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoThunk.pending, pendingCase)
      .addCase(fetchUserDetailsThunk.pending, pendingCase)
      .addCase(registerAsProctorThunk.pending, pendingCase)
      .addCase(authAsProctorThunk.pending, pendingCase)
      .addCase(logoutThunk.pending, pendingCase)

    builder
      .addCase(getUserInfoThunk.rejected, errorCase)
      .addCase(fetchUserDetailsThunk.rejected, errorCase)
      .addCase(registerAsProctorThunk.rejected, errorCase)
      .addCase(authAsProctorThunk.rejected, errorCase)
      .addCase(logoutThunk.rejected, errorCase)

    builder
      .addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.loading = false
        const {userEmail, username, address, userOrganizationId, userGroups} =
          action.payload

        const serializedGroups = userGroups?.length
          ? userGroups
          : [Group.Student]

        if (!state.email) state.email = userEmail
        if (!state.user) state.user = username
        if (!state.userOrganizationId)
          state.userOrganizationId = userOrganizationId
        state.userGroups = serializedGroups
        if (!state.address)
          state.address = address ? JSON.parse(address) : null
        state.loading = false
        state.errLogin = false
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false
        Object.keys(state).forEach((key) => {
          state[key] = initialState[key]
        })
      })
      .addCase(fetchUserDetailsThunk.fulfilled, (state, {payload}) => {
        state.loading = false
        if (!payload) return
        replaceStateVars(state, payload)
      })
      .addCase(authAsProctorThunk.fulfilled, (state, {payload}) => {
        state.loading = false
      })
      .addCase(registerAsProctorThunk.fulfilled, (state, {payload}) => {
        state.loading = false
        if (!payload) return
        replaceStateVars(state, payload)
      })
  }
})

export default userSlice.reducer
export const {setFakeGroup} = userSlice.actions

function replaceStateVars(state: any, object: IUserInfo) {
  Object.entries(object).forEach(([key, value]) => {
    if (key === "groups" && value) {
      if (!state.userGroups?.length)
        state.userGroups = value?.length ? value : [Group.Student]
      return
    }
    if (value) state[key] = value
  })
}
