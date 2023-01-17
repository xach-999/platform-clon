import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {useMutation} from "@apollo/client"
import {Autocomplete, Box, Button, IconButton, TextField, Typography} from "@mui/material"
import {CREATE_INVITATION} from "api/apollo/mutations"
import {useFormik} from "formik"
import {CreateInvitationMutation, CreateInvitationMutationVariables} from "generated/graphql"
import _ from "lodash"
import React from "react"
import {useDispatch, useSelector} from "store"
import {customNotifications} from "store/slices/notifier/notificationObject"
import {handleError, notifyUser} from "store/slices/notifier/notifier"
import {IClassroomItem} from "types/common"

interface Props {
  classroom: IClassroomItem
  backHandler?: () => void
  onFinish: () => void
  onClose: () => void
}

export default function InviteForm({
  classroom,
  backHandler,
  onFinish,
  onClose
}: Props) {
  const dispatch = useDispatch()

  const schoolStudents = useSelector((store) => store.schoolSlice.students)

  const [createInvitation, invitationMutation] = useMutation<
    CreateInvitationMutation,
    CreateInvitationMutationVariables
  >(CREATE_INVITATION)

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    onSubmit: (values) => {
      const student = schoolStudents.find((i) => i.email === values.email)

      if (values.email && student) {
        createInvitation({
          variables: {
            createInvitationInput: {
              classroomId: classroom._id,
              userId: student._id
            }
          }
        }).then(() => {
          dispatch(notifyUser({
            message: customNotifications.STUDENT_INVITED_SUCCESS
          }))
          formik.resetForm()
          onFinish()
        }).catch((err) => {
          dispatch(handleError(err))
        })
      } else {
        dispatch(notifyUser({
          variant: "error",
          message: "Student must be registered first"
        }))
      }
    }
  })

  return (
    <Box pt={3} pb={2} px={2}>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            {!!backHandler && (
              <IconButton color="secondary" onClick={backHandler}>
                <ArrowBackIcon/>
              </IconButton>
            )}
          </Box>
          <Box px={2}>
            <Typography variant="h5" textAlign="center">
              Invite Student to your classroom
            </Typography>
          </Box>
          <Box width={!!backHandler ? 40 : 0}/>
        </Box>
      </Box>
      <Box>
        <Box px={2} py={4}>
          <Box display="flex" justifyItems="center" alignItems="center">
            <Autocomplete
              fullWidth
              freeSolo
              disableClearable
              options={_.uniqBy(schoolStudents, "email").filter(i => i.email).map(i => i.email)}
              onChange={(_, value) => formik.setFieldValue("email", value)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  size="small"
                  required
                  fullWidth
                  autoFocus
                  placeholder="Student Email"
                  onChange={(e) => formik.setFieldValue("email", e.target.value)}
                />
              )}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            disabled={invitationMutation.loading}
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.values.email || invitationMutation.loading}
            onClick={() => formik.handleSubmit()}>
            Invite
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
