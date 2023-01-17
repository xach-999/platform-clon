import "react-perfect-scrollbar/dist/css/styles.css"
import "quill/dist/quill.snow.css"
import "nprogress/nprogress.css"
import "./index.css"
import "react-toastify/dist/ReactToastify.css"
import Amplify from "aws-amplify"
import React from "react"
import ReactDOM from "react-dom"
import {HelmetProvider} from "react-helmet-async"
import {BrowserRouter} from "react-router-dom"
import {Provider as ReduxProvider} from "react-redux"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns"
import StyledEngineProvider from "@mui/material/StyledEngineProvider"
import App from "./App"
import {AuthProvider} from "contexts/AmplifyContext"
import {SettingsProvider} from "contexts/SettingsContext"
import store from "store"

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_AWS_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USERPOOL_ID,
    userPoolWebClientId:
      process.env.REACT_APP_AWS_COGNITO_USERPOOL_WEB_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID
  }
})

ReactDOM.render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </SettingsProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </ReduxProvider>
  </HelmetProvider>,
  document.getElementById("root")
)
