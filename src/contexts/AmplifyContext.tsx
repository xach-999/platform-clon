import client from "api/apollo"
import {createContext, useEffect, useReducer, useState} from "react"
import type {FC} from "react"
import PropTypes, {InferProps} from "prop-types"
import Amplify, {Auth} from "aws-amplify"
import {CognitoUser} from "@aws-amplify/auth"

import {amplifyConfig} from "config"
import type {User} from "types/user"

Amplify.configure(amplifyConfig)

const authProviderProps = {
  children: PropTypes.element.isRequired
}

interface State {
  isInitialized: boolean
  isAuthenticated: boolean
  user: User | null
  cognitoUser: CognitoUserWithAttributes<CognitoUserAttributes> | null
}

/**
 * HACK: https://github.com/aws-amplify/amplify-js/issues/4927
 */
export interface CognitoUserWithAttributes<T = any> extends CognitoUser {
  attributes: T
}

export interface CognitoUserAttributes {
  sub: string
  /** JSON string of CognitoUserAddress */
  address: string
  /** YYYY-MM-DD */
  // birthdate: string
  email: string
  email_verified: boolean
  // phone_number: string
  phone_verified: boolean
  family_name: string
  given_name: string
}

export interface CognitoUserAddress {
  // address: string
  city: string
  country: string
  state: string
  postcode: string
}

interface RegisterProps {
  firstName: string
  lastName: string
  email: string
  password: string
  // birthdate: string
  // phone: string
  // address: string
  city: string
  country: string
  state: string
  postcode: string
}

type UpdateProps = Omit<RegisterProps, "password">

interface AuthContextValue extends State {
  loading: boolean
  platform: "Amplify"
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterProps) => Promise<void>
  update: (data: UpdateProps) => Promise<void>
  verifyCode: (username: string, code: string) => Promise<void>
  resendCode: (username: string) => Promise<void>
  passwordRecovery: (username: string) => Promise<void>
  passwordReset: (
    username: string,
    code: string,
    newPassword: string
  ) => Promise<void>
}

type InitializeAction = {
  type: "INITIALIZE"
  payload: {
    isAuthenticated: boolean
    user: User | null
    cognitoUser: State["cognitoUser"]
  }
}

type LoginAction = {
  type: "LOGIN"
  payload: {
    user: User
    cognitoUser: State["cognitoUser"]
  }
}

type LogoutAction = {
  type: "LOGOUT"
}

type RegisterAction = {
  type: "REGISTER"
}

type VerifyCodeAction = {
  type: "VERIFY_CODE"
}

type UpdateAction = {
  type: "UPDATE"
}

type ResendCodeAction = {
  type: "RESEND_CODE"
}
type PasswordRecoveryAction = {
  type: "PASSWORD_RECOVERY"
}

type PasswordResetAction = {
  type: "PASSWORD_RESET"
}

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | VerifyCodeAction
  | UpdateAction
  | ResendCodeAction
  | PasswordRecoveryAction
  | PasswordResetAction

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  cognitoUser: null
}

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const {isAuthenticated, user, cognitoUser} = action.payload

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      cognitoUser
    }
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const {user, cognitoUser} = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
      cognitoUser
    }
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
    cognitoUser: null
  }),
  REGISTER: (state: State): State => ({...state}),
  VERIFY_CODE: (state: State): State => ({...state}),
  RESEND_CODE: (state: State): State => ({...state}),
  PASSWORD_RECOVERY: (state: State): State => ({...state}),
  PASSWORD_RESET: (state: State): State => ({...state})
}

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: "Amplify",
  loading: false,
  initialize: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  update: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve()
})

export const AuthProvider: FC<InferProps<typeof authProviderProps>> = (
  props
) => {
  const {children} = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setIsLoading] = useState(false)

  const initialize = async (): Promise<void> => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser({
        bypassCache: true
      })
      // const cognitoUser = await Auth.currentUserInfo()
      const groups =
        cognitoUser.signInUserSession?.idToken?.payload["cognito:groups"] || []
      const address = cognitoUser?.attributes?.address
        ? JSON.parse(cognitoUser.attributes.address)
        : null

      // Here you should extract the complete user profile to make it
      // available in your entire app.
      // The auth state only provides basic information.

      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: true,
          user: {
            id: cognitoUser.attributes.sub,
            avatar: "/static/avatar_neutral2.png",
            email: cognitoUser.attributes.email,
            firstName: cognitoUser.attributes.given_name,
            lastName: cognitoUser.attributes.family_name,
            // birthdate: cognitoUser.attributes.birthdate,
            // phone: cognitoUser.attributes.phone_number,
            // address: address?.address || null,
            city: address?.city || null,
            country: address?.country || null,
            state: address?.state || null,
            postcode: address?.postcode || null,
            groups
          },
          cognitoUser: cognitoUser
        }
      })
    } catch (error) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
          cognitoUser: null
        }
      })
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      const cognitoUser = await Auth.signIn(email, password)
      const groups =
        cognitoUser.signInUserSession?.idToken?.payload["cognito:groups"] || []
      const address = cognitoUser?.attributes?.address
        ? JSON.parse(cognitoUser.attributes.address)
        : null

      if (cognitoUser.challengeName) {
        console.error(
          `Unable to login, because challenge "${cognitoUser.challengeName}" is mandated and we did not handle this case.`
        )
        return
      }

      dispatch({
        type: "LOGIN",
        payload: {
          user: {
            id: cognitoUser.attributes.sub,
            avatar: "/static/avatar_neutral2.png",
            email: cognitoUser.attributes.email,
            firstName: cognitoUser.attributes.given_name,
            lastName: cognitoUser.attributes.family_name,
            // birthdate: cognitoUser.attributes.birthdate,
            // phone: cognitoUser.attributes.phone_number,
            // address: address?.address || null,
            city: address?.city || null,
            country: address?.country || null,
            state: address?.state || null,
            postcode: address?.postcode || null,
            groups
          },
          cognitoUser: cognitoUser
        }
      })
    } catch (err) {
      setIsLoading(false)
      console.warn(err)
      throw err
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    await Auth.signOut()
    await client.resetStore()
    dispatch({
      type: "LOGOUT"
    })
    setIsLoading(false)
  }

  const register = async ({
    firstName,
    lastName,
    email,
    password,
    // birthdate,
    // phone,
    // address,
    city,
    country,
    state,
    postcode
  }: RegisterProps): Promise<void> => {
    setIsLoading(true)
    await Auth.signUp({
      username: email,
      password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
        // phone_number: phone,
        email,
        // birthdate,
        address: JSON.stringify({
          // address,
          city,
          country,
          state,
          postcode
        })
      }
    })
    setIsLoading(false)
    dispatch({
      type: "REGISTER"
    })
  }

  const update = async ({
    firstName,
    lastName,
    email,
    // birthdate,
    // phone,
    // address,
    city,
    country,
    state,
    postcode
  }: UpdateProps): Promise<void> => {
    const user = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(user, {
      given_name: firstName,
      family_name: lastName,
      // phone_number: phone,
      email,
      // birthdate,
      address: JSON.stringify({
        // address,
        city,
        state,
        country,
        postcode
      })
    })

    await initialize()

    dispatch({
      type: "UPDATE"
    })
  }

  const verifyCode = async (username: string, code: string): Promise<void> => {
    await Auth.confirmSignUp(username, code)
    dispatch({
      type: "VERIFY_CODE"
    })
  }

  const resendCode = async (username: string): Promise<void> => {
    await Auth.resendSignUp(username)
    dispatch({
      type: "RESEND_CODE"
    })
  }

  const passwordRecovery = async (username: string): Promise<void> => {
    await Auth.forgotPassword(username)
    dispatch({
      type: "PASSWORD_RECOVERY"
    })
  }

  const passwordReset = async (
    username: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    await Auth.forgotPasswordSubmit(username, code, newPassword)
    dispatch({
      type: "PASSWORD_RESET"
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "Amplify",
        initialize,
        login,
        logout,
        register,
        update,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = authProviderProps

export default AuthContext
