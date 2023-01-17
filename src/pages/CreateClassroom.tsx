import React, {useMemo} from "react"
import {useNavigate} from "react-router-dom"
import {Button, TextField, Grid, Box, useTheme} from "@mui/material"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import useMainPageLink from "hooks/useMainPageLink"
import {useDispatch, useSelector} from "store"
import {LINKS} from "consts/links"
import {useFormik} from "formik"
import {createClassThunk} from "store/slices/schoolSlice/schoolSlice"

export default function CreateClassroom() {
  const theme = useTheme()

  const loading = useSelector((store) => store.schoolSlice.loading)
  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const pageTitle = useMemo(() => "Classrooms", [])
  const {mainPageLink} = useMainPageLink()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      name: ""
    },
    onSubmit: async (values) => {
      await dispatch(createClassThunk({
        ...values,
        schoolId
      }))
      formik.resetForm()
      navigate(LINKS.classrooms)
    }
  })

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={pageTitle}
      pageTitle={pageTitle}
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: LINKS.classrooms,
        text: "Classrooms"
      }, {
        path: null,
        text: "Create Classroom"
      }]}>
      <Box
        minHeight={theme.spacing(32)}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={16}>
        <form onSubmit={formik.handleSubmit} style={{width: "100%"}}>
          <Grid
            style={{padding: "1rem 0"}}
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center">
            <Grid item xs={6}>
              <TextField
                id="name"
                size="small"
                autoFocus
                fullWidth
                placeholder="Class Name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={loading}>
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </CardWithBreadcrumbs>
  )
}
