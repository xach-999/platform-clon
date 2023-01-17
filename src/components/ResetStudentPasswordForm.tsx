import {
  Box,
  Button,
  TextField,
  Theme,
  Typography
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {passwordValidationRegex} from "consts/regex"
import {Formik} from "formik"
import React, {useMemo} from "react"
import {useDispatch} from "store"
import {updateStudentPassThunk} from "store/slices/schoolSlice/schoolSlice"
import {IStudentItem} from "types/common"
import * as Yup from "yup"

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    minWidth: "500px",
    [theme.breakpoints.down(undefined)]: {
      width: "95%",
      minWidth: "0"
    }
  }
}))

interface Props {
  student: IStudentItem
  onFinish: () => void
}

export default function ResetStudentPasswordForm({
  student,
  onFinish
}: Props) {
  const s = useStyles()

  const dispatch = useDispatch()

  const formInitialValues = useMemo(() => {
    return {
      newPass: "",
      repeatPass: ""
    }
  }, [])


  const handleSubmit = (data: typeof formInitialValues) => {
    onFinish()

    dispatch(updateStudentPassThunk({
      password: data.newPass,
      studentId: student.id
    }))
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={Yup.object().shape({
        newPass: Yup.string()
          .min(6, "Minimal length is 6 characters")
          .max(35, "Maximum length is 35 characters")
          .matches(passwordValidationRegex, "Password must contain at least 1 number and one uppercase letter")
          .required("New password password is required"),
        repeatPass: Yup.string()
          .oneOf([Yup.ref("newPass")], "This field must be the same as \"New Password field\"")
          .required("Repeat password field is required")
      })}
      onSubmit={handleSubmit}>
      {({
        errors,
        values,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
      }): JSX.Element => (
        <form className={s.form} onSubmit={handleSubmit}>
          <Box pt={3} pb={1} px={6}>
            <Typography variant="h5" textAlign="center" mb={2}>
              Reset password
            </Typography>
            <Box>
              <Box mb={2}>
                <TextField
                  autoComplete="off"
                  name="newPass"
                  value={values["newPass"] || ""}
                  error={!!(touched["newPass"] && errors["newPass"])}
                  helperText={touched["newPass"] && (errors["newPass"] as string)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="New Password"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  autoComplete="off"
                  name="repeatPass"
                  value={values["repeatPass"] || ""}
                  error={!!(touched["repeatPass"] && errors["repeatPass"])}
                  helperText={touched["repeatPass"] && (errors["repeatPass"] as string)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Repeat Password"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2} p={2}>
            <Button
              type="button"
              onClick={onFinish}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained">
              Save Changes
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  )
}
