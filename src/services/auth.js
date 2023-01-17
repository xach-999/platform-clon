import {Auth} from "aws-amplify"
import apiCall from "api/rest"
import {ENDPOINT} from "consts/endpoints"

export async function getCurrentUserInfo() {
  return Auth.currentUserInfo()
}

const authAsProctor = (proctorCredentials) => {
  return apiCall({
    url: ENDPOINT.authAsProctor,
    method: "POST",
    data: proctorCredentials
  })
}

export const getCognitoGroups = async () => {
  const answer = await Auth.currentSession()
  const {idToken} = answer
  return idToken.payload["cognito:groups"] || []
}

export async function getSession() {
  try {
    const sessionData = await Auth.currentSession()

    return {
      accessToken: sessionData.getIdToken().getJwtToken(),
      refreshToken: sessionData.getRefreshToken()
    }
  } catch (err) {
    return null
  }
}

export async function forgotPassword(email) {
  try {
    await Auth.forgotPassword(email)
    return true
  } catch (err) {
    console.log(err)
    return err
  }
}

export async function resetPassword(email, code, password) {
  try {
    await Auth.forgotPasswordSubmit(email, code, password)
    return true
  } catch (err) {
    console.log(err)
    return err
  }
}

export async function resendConfirmationCode(
  username,
) {
  try {
    const ressult = await Auth.resendSignUp(username)
    return {
      success: true,
      response: ressult
    }
  } catch (err) {
    return {
      success: false,
      response: err
    }
  }
}

const authService = {
  getCurrentUserInfo,
  getCognitoGroups,
  authAsProctor
}

export default authService
