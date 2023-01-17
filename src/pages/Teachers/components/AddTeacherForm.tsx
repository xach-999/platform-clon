import React from "react"
import {Formik} from "formik"
import * as Yup from "yup"
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Theme,
  Typography
} from "@mui/material"
import {createStyles, makeStyles} from "@mui/styles"
import {ISerializedTeacherItem} from "types/common"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      minWidth: "500px",
      [theme.breakpoints.down(undefined)]: {
        width: "95%",
        minWidth: "0"
      }
    }
  })
)

const inputItems = [
  {
    label: "Email",
    fieldName: "email"
  }
]

interface Props {
  onAddNewTeacher: (teacherObject: ISerializedTeacherItem) => void
  onEditTeacher: (teacherObject: ISerializedTeacherItem) => void
  teacher?: ISerializedTeacherItem
  type: string
}

export default function AddTeacherForm({
  onAddNewTeacher,
  onEditTeacher,
  teacher,
  type
}: Props) {
  const classes = useStyles()

  const onSubmitTeacher = (values) => {
    if (type === "add") return onAddNewTeacher({...values})
    onEditTeacher({...values, teacherId: teacher.id})
  }

  return (
    <Formik
      initialValues={{
        email: teacher?.email || ""
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required")
      })}
      onSubmit={onSubmitTeacher}>
      {({
        errors,
        values,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
      }): JSX.Element => (
        <form className={classes.form} onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
                direction="column"
                justifyContent="space-between">
                <Grid item>
                  <Grid container spacing={3} direction="column">
                    <Grid item>
                      <Typography variant="h5" textAlign="center">
                        Add new teacher
                      </Typography>
                    </Grid>
                    {inputItems.map(({label, fieldName}) => {
                      return (
                        <Grid item key={fieldName}>
                          <TextField
                            name={fieldName}
                            value={values[fieldName] || ""}
                            error={Boolean(
                              touched[fieldName] && errors[fieldName]
                            )}
                            helperText={touched[fieldName] &&
                              (errors[fieldName] as string)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label={label}
                            type="text"
                            fullWidth
                            variant="outlined"
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
                <Grid item display="flex" justifyContent="flex-end">
                  <Button color="primary" type="submit" variant="contained">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  )
}
