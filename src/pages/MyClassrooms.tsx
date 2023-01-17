import {useMutation} from "@apollo/client"
import CancelIcon from "@mui/icons-material/Cancel"
import DoneIcon from "@mui/icons-material/Done"
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme
} from "@mui/material"
import {DELETE_JOIN_REQUEST, JOIN_CLASSROOM, LEAVE_CLASSROOM, RESPOND_INVITATION} from "api/apollo/mutations"
import ConfirmationAlert from "components/ConfirmationAlert"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import Dialog from "components/Dialog"
import {useFormik} from "formik"
import {
  Classroom, DeleteJoinRequestMutation, DeleteJoinRequestMutationVariables,
  Invitation,
  InvitationStatus, JoinClassroomByCodeMutation, JoinClassroomByCodeMutationVariables,
  LeaveClassroomMutation,
  LeaveClassroomMutationVariables,
  RespondInvitationMutation,
  RespondInvitationMutationVariables, WaitingList
} from "generated/graphql"
import useMainPageLink from "hooks/useMainPageLink"
import useSearchInput from "hooks/useSearchInput"
import Plus from "assets/icons/Plus"
import React, {useMemo, useState} from "react"
import {useDispatch, useSelector} from "store"
import {handleError} from "store/slices/notifier/notifier"
import {fetchUserDetailsThunk} from "store/slices/userSlice/userSlice"
import formatDate from "utils/formatDate"

export default function MyClassrooms() {
  const theme = useTheme()

  const dispatch = useDispatch()

  const pageTitle = useMemo(() => "My Classrooms", [])
  const {mainPageLink} = useMainPageLink()
  const {SearchInputJSX, searchInput} = useSearchInput("Search Classrooms")
  const {
    SearchInputJSX: RequestsSearchInputJSX,
    searchInput: RequestsSearchInput
  } = useSearchInput("Search Pending Requests")

  const user = useSelector((store) => store.userSlice)
  const classrooms = user.classrooms
  const classroomsRequests = [
    ...user.invitations.filter(i => i.status === "pending"),
    ...user.waitingList
  ]
  const userLoading = useSelector((store) => store.userSlice.loading)
  const schoolLoading = useSelector((store) => store.schoolSlice.loading)
  const [showAddClassroomPopUp, setShowAddClassroomPopUp] = useState(false)
  const [classroomToUnenroll, setClassroomToUnenroll] = useState<Classroom | null>(null)

  const [leaveClassroom] = useMutation<LeaveClassroomMutation, LeaveClassroomMutationVariables>(LEAVE_CLASSROOM)
  const [respondInvitation] = useMutation<
    RespondInvitationMutation,
    RespondInvitationMutationVariables
  >(RESPOND_INVITATION)
  const [joinClassroom] = useMutation<
    JoinClassroomByCodeMutation,
    JoinClassroomByCodeMutationVariables
  >(JOIN_CLASSROOM)
  const [deleteJoinRequest] = useMutation<
    DeleteJoinRequestMutation,
    DeleteJoinRequestMutationVariables
  >(DELETE_JOIN_REQUEST)

  const formik = useFormik({
    initialValues: {
      code: ""
    },
    onSubmit: async (values) => {
      handleJoin(values.code)
      formik.resetForm()
      setShowAddClassroomPopUp(false)
    }
  })

  const tableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "text",
      headerText: "School",
      fieldName: "school.name"
    }, {
      type: "text",
      headerText: "Classroom",
      fieldName: "name"
    }, {
      type: "custom",
      headerText: "Teachers",
      content: (data: Classroom) => {
        return String(data.teachers.length)
      }
    }, {
      type: "custom",
      headerText: "",
      content: (data: Classroom) => (
        <Button
          color="error"
          size="small"
          onClick={() => setClassroomToUnenroll(data)}>
          Unenroll
        </Button>
      )
    }]
  }, [])

  const requestsTableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "text",
      headerText: "School",
      fieldName: "classroom.school.name"
    }, {
      type: "text",
      headerText: "Classroom",
      fieldName: "classroom.name"
    }, {
      type: "custom",
      headerText: "Invited On",
      content: (data) => {
        return "createdAt" in data ? formatDate(data.createdAt) : ""
      }
    }, {
      type: "custom",
      headerText: "",
      content: (data: Invitation | WaitingList) => (
        <>
          {data.__typename === "WaitingList" ? (
            <Button
              color="warning"
              size="small"
              onClick={() => handleCancelRequest(data._id)}
              startIcon={<CancelIcon/>}>
              Cancel request
            </Button>
          ) : (
            <Box>
              <Button
                color="success"
                size="small"
                onClick={() => handleManageInvitation("ACCEPT", data._id)}
                startIcon={<DoneIcon/>}>
                Accept
              </Button>
              <Button
                color="error"
                size="small"
                onClick={() => handleManageInvitation("REJECT", data._id)}
                startIcon={<CancelIcon/>}
                sx={{ml: 2}}>
                Decline
              </Button>
            </Box>
          )}
        </>
      )
    }]
  }, [])

  const handleJoin = (joinCode: string) => {
    joinClassroom({
      variables: {
        joinCode
      }
    }).then(() => {
      dispatch(fetchUserDetailsThunk())
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  const handleUnenroll = (id: string) => {
    leaveClassroom({
      variables: {
        classroomId: id
      }
    }).then(() => {
      dispatch(fetchUserDetailsThunk())
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  const handleManageInvitation = (action: "ACCEPT" | "REJECT", id: string) => {
    respondInvitation({
      variables: {
        decision: action === "ACCEPT" ? InvitationStatus.Accepted : InvitationStatus.Rejected,
        invitationId: id
      }
    }).then(() => {
      dispatch(fetchUserDetailsThunk())
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  const handleCancelRequest = (id: string) => {
    deleteJoinRequest({
      variables: {
        joinRequestId: id
      }
    }).then(() => {
      dispatch(fetchUserDetailsThunk())
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={pageTitle}
      pageTitle={pageTitle}
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: pageTitle
      }]}>
      <Box minHeight={theme.spacing(32)} mb={4}>
        <Paper variant="outlined" sx={{p: 2}}>
          <Typography color="textPrimary" variant="h6" mb={2}>
            Classrooms
          </Typography>
          {!userLoading && (
            <Box
              display="flex"
              flexDirection={!!classrooms?.length ? "row" : "column"}
              alignItems="center"
              justifyContent={!!classrooms?.length ? "space-between" : "center"}
              mb={!classrooms?.length ? 4 : 0}>
              <Box mb={!classrooms?.length ? 2 : 0}>
                {!!classrooms?.length ? (
                  SearchInputJSX
                ) : (
                  <Typography color="textPrimary" variant="h6">
                    No classrooms found
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                color="success"
                size="large"
                onClick={() => setShowAddClassroomPopUp(true)}
                startIcon={<Plus/>}>
                Join Classroom
              </Button>
            </Box>
          )}
          <Dialog
            open={showAddClassroomPopUp}
            maxWidth="md"
            title="Add New Classroom"
            onClose={() => setShowAddClassroomPopUp(false)}
            actions={[{
              label: "Cancel",
              onClick: () => setShowAddClassroomPopUp(false)
            }, {
              label: "Join",
              variant: "contained",
              onClick: () => formik.handleSubmit()
            }]}>
            <Box
              display="flex"
              justifyItems="center"
              alignItems="center"
              pt={2}
              width="30vw">
              <TextField
                id="code"
                size="small"
                fullWidth
                autoFocus
                placeholder="Join Code"
                onChange={formik.handleChange}
                value={formik.values.code}
              />
            </Box>
          </Dialog>
          <Box mt={2}>
            <CustomSearchTable
              rows={classrooms}
              rowsPerPageOption={10}
              tableSchema={tableSchema}
              loading={schoolLoading}
              searchFields={[
                "name",
                "school.name",
                "teacher.firstName",
                "teacher.lastName"
              ]}
              searchInput={searchInput}
            />
            <ConfirmationAlert
              isOpen={!!classroomToUnenroll}
              setOpen={() => setClassroomToUnenroll(null)}
              handleConfirm={() => handleUnenroll(classroomToUnenroll._id)}
              handleCancel={() => setClassroomToUnenroll(null)}
              dialogTitle={`Are you sure you want to leave ${classroomToUnenroll?.name}?`}
              cancelText="No"
              confirmText={{color: "error", text: "Yes"}}
            />
          </Box>
        </Paper>
        {!!classroomsRequests?.length && (
          <Box mt={2}>
            <Paper variant="outlined" sx={{p: 2}}>
              <Typography color="textPrimary" variant="h6" mb={2}>
                Pending Requests
              </Typography>
              <Box mt={2}>
                <Box>
                  <Box mb={2}>{RequestsSearchInputJSX}</Box>
                  <CustomSearchTable
                    rows={classroomsRequests}
                    rowsPerPageOption={50}
                    tableSchema={requestsTableSchema}
                    loading={userLoading}
                    searchFields={["name"]}
                    searchInput={RequestsSearchInput}
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </CardWithBreadcrumbs>
  )
}
