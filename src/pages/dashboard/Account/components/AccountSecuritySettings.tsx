import * as Yup from "yup"
import {Formik} from "formik"
import {useSnackbar} from "notistack"
import {useMutation} from "@apollo/client"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  TextField
} from "@mui/material"
import {UPDATE_MY_PASSWORD} from "api/apollo/mutations"
import {getApiCallHeaders} from "api/rest"
import {Mutation, MutationUpdateMyPasswordArgs} from "generated/graphql"

export default function AccountSecuritySettings(props) {
  const {enqueueSnackbar} = useSnackbar()

  const [updateMyPassword] = useMutation<Mutation["updateMyPassword"], MutationUpdateMyPasswordArgs>(UPDATE_MY_PASSWORD)

  return (
    <Box width={{md: "50%", xs: "100%"}}>
      <Formik
        initialValues={{
          password: "",
          passwordConfirm: "",
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .min(7, "Must be at least 7 characters")
            .max(255)
            .required("Required"),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required")
        })}
        onSubmit={async (values, {resetForm, setErrors}): Promise<void> => {
          resetForm()

          updateMyPassword({
            context: {
              headers: await getApiCallHeaders()
            },
            variables: {newPassword: values.password}
          })
            .then((_) => {
              enqueueSnackbar("Password updated", {
                anchorOrigin: {
                  horizontal: "right",
                  vertical: "top"
                },
                variant: "success"
              })
            })
            .catch((err) => {
              setErrors({submit: err.message})
              enqueueSnackbar(err.message, {
                anchorOrigin: {
                  horizontal: "right",
                  vertical: "top"
                },
                variant: "error"
              })
            })
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
          <form onSubmit={handleSubmit} {...props} style={{width: "100%"}}>
            <Card>
              <CardHeader title="Change Password"/>
              <CardContent>
                <Box>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      label="Password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                  </Box>
                  <Box>
                    <TextField
                      error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
                      fullWidth
                      helperText={touched.passwordConfirm && errors.passwordConfirm}
                      label="Password Confirmation"
                      name="passwordConfirm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.passwordConfirm}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>
                      {errors.submit as string}
                    </FormHelperText>
                  </Box>
                )}
              </CardContent>
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained">
                  Change Password
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </Box>
  )
}
