import {useNavigate} from "react-router-dom"
import * as Yup from "yup"
import {Formik} from "formik"
import {Box, Button, FormHelperText, TextField} from "@mui/material"
import useAuth from "hooks/useAuth"
import useIsMountedRef from "hooks/useIsMountedRef"
import {Person} from "@mui/icons-material"
import LockIcon from "@mui/icons-material/Lock"
import InputAdornment from "@mui/material/InputAdornment"
import {useDispatch} from "store"
import {handleError} from "store/slices/notifier/notifier"
import CustomErrorClass from "store/slices/notifier/customErrorClass"
import {customErrors} from "store/slices/notifier/errorObject"

export default function LoginAmplify(props) {
  const isMountedRef = useIsMountedRef()
  const navigate = useNavigate()
  const {login} = useAuth() as any
  const dispatch = useDispatch()

  return (
    <Formik
      initialValues={{
        emailOrUsername: "",
        password: "",
        submit: null
      }}
      validationSchema={Yup.object().shape({
        emailOrUsername: Yup.string().max(255).required("Username is required"),
        password: Yup.string().required("Password is required")
      })}
      onSubmit={async (
        values,
        {setErrors, setStatus, setSubmitting}
      ): Promise<void> => {
        try {
          await login(values.emailOrUsername, values.password)

          if (isMountedRef.current) {
            setStatus({success: true})
            setSubmitting(false)
          }
        } catch (err) {
          dispatch(
            handleError(new CustomErrorClass(customErrors.INVALID_CREDENTIALS))
          )

          if (err.code === "UserNotConfirmedException") {
            navigate("/authentication/verify-code", {
              state: {
                username: values.emailOrUsername
              }
            })
            return
          }

          if (isMountedRef.current) {
            setStatus({success: false})
            setErrors({submit: err.message})
            setSubmitting(false)
          }
        }
      }}>
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <TextField
            autoFocus
            error={Boolean(touched.emailOrUsername && errors.emailOrUsername)}
            fullWidth
            helperText={touched.emailOrUsername && errors.emailOrUsername}
            label="Username"
            margin="normal"
            name="emailOrUsername"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={values.emailOrUsername}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Person/>
                </InputAdornment>
              )
            }}
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <LockIcon/>
                </InputAdornment>
              )
            }}
          />
          {errors.submit && (
            <Box>
              <FormHelperText error>
                {/*{errors.submit}*/}
                The credentials you have entered are invalid.
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained">
              Log In
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  )
}
