import axios, {AxiosRequestConfig} from "axios"
import {Auth} from "aws-amplify"

const client = axios.create({baseURL: process.env.REACT_APP_API_BASE_URL})

export const getApiCallHeaders = async () => {
  return {
    idtoken: (await Auth.currentSession()).getIdToken().getJwtToken()
  }
}

const apiCall = async function (options: AxiosRequestConfig) {
  const headers = await getApiCallHeaders()

  const onSuccess = function (response) {
    return response.data
  }
  const onError = function (error) {
    return Promise.reject(error.response || error.message)
  }

  const idToken = {
    headers
  }

  return client({...options, ...idToken})
    .then(onSuccess)
    .catch(onError)
}

export default apiCall
