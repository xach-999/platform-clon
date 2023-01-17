import {useNavigate} from "react-router-dom"
import * as Yup from "yup"
import {Formik} from "formik"
import {Box, Button, FormHelperText, TextField} from "@mui/material"
import useAuth from "hooks/useAuth"
import useIsMountedRef from "hooks/useIsMountedRef"

export default function PasswordRecoveryAmplify() {
  const isMountedRef = useIsMountedRef()
  const {passwordRecovery} = useAuth() as any
  const navigate = useNavigate()

  return (
    <Formik
      initialValues={{
        email: "",
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required")
      })}
      onSubmit={async (
        values,
        {setErrors, setStatus, setSubmitting}
      ): Promise<void> => {
        try {
          await passwordRecovery(values.email)

          navigate("/authentication/password-reset", {
            state: {
              username: values.email
            }
          })
        } catch (err) {
          console.error(err)
          if (isMountedRef.current) {
            setStatus({success: false})
            setErrors({submit: err.message})
            setSubmitting(false)
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{mt: 3}}>
              <FormHelperText error>{errors.submit as string}</FormHelperText>
            </Box>
          )}
          <Box sx={{mt: 3}}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Recover Password
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  )
}
