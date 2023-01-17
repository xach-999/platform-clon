import {useMutation, useQuery} from "@apollo/client"
import CancelIcon from "@mui/icons-material/Cancel"
import DoneIcon from "@mui/icons-material/Done"
import {Box, Button, Paper, Typography} from "@mui/material"
import {DELETE_INVITATION, RESPOND_JOIN_REQUEST} from "api/apollo/mutations"
import {GET_PENDING_INVITATIONS} from "api/apollo/queries"
import ConfirmationAlert from "components/ConfirmationAlert"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import ManageStudentsWithAssignPT from "components/ManageStudentsWithAssignPT"
import {
  DeleteInvitationMutation,
  DeleteInvitationMutationVariables,
  Query,
  QueryGetPendingInvitationsArgs,
  RespondClassroomJoinRequestMutation,
  RespondClassroomJoinRequestMutationVariables,
  WaitingListStatus
} from "generated/graphql"
import React, {useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "store"
import {customNotifications} from "store/slices/notifier/notificationObject"
import {handleError, notifyUser} from "store/slices/notifier/notifier"
import {
  fetchAvailableClassroomsThunk,
  fetchSchoolStudentsThunk,
  fetchStudentsForClassThunk
} from "store/slices/schoolSlice/schoolSlice"
import {IClassroomItem} from "types/common"
import formatDate from "utils/formatDate"

interface Props {
  classroom: IClassroomItem
}

export default function RosterContent({classroom}: Props) {
  const dispatch = useDispatch()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const schoolStudents = useSelector((store) => store.schoolSlice.students)

  const [invitationToCancel, setInvitationToCancel] = useState<typeof waitingList[0] | null>(null)

  const pendingInvitationsQuery = useQuery<Query, QueryGetPendingInvitationsArgs>(GET_PENDING_INVITATIONS, {
    variables: {
      classroomId: classroom._id
    }
  })

  const waitingList = useMemo(() => {
    if ((pendingInvitationsQuery.data || classroom.waitingList) && schoolStudents) {
      const list = [...(pendingInvitationsQuery.data?.getPendingInvitations || []), ...classroom.waitingList]

      return list.map(i => ({
        ...i,
        id: i._id,
        user: i.__typename === "WaitingList" ? i.student : schoolStudents.find(item => item._id === i.userId)
      }))
    }
  }, [pendingInvitationsQuery.data, classroom.waitingList, schoolStudents])

  const [respondJoinRequest] = useMutation<
    RespondClassroomJoinRequestMutation,
    RespondClassroomJoinRequestMutationVariables
  >(RESPOND_JOIN_REQUEST)
  const [cancelInvitation] = useMutation<
    DeleteInvitationMutation,
    DeleteInvitationMutationVariables
  >(DELETE_INVITATION)

  const waitingListTableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "text",
      headerText: "Email",
      fieldName: "user.email"
    }, {
      type: "text",
      headerText: "First Name",
      fieldName: "user.firstName"
    }, {
      type: "text",
      headerText: "Last Name",
      fieldName: "user.lastName"
    }, {
      type: "text",
      headerText: "Status",
      fieldName: "status"
    }, {
      type: "custom",
      headerText: "Created At",
      content: (data) => {
        return "createdAt" in data ? formatDate(data.createdAt) : ""
      }
    }, {
      type: "custom",
      headerText: "",
      content: (data: typeof waitingList[0]) => (
        <>
          {data.__typename === "Invitation" ? (
            <Button
              color="error"
              size="small"
              onClick={() => setInvitationToCancel(data)}>
              Cancel
            </Button>
          ) : (
              <Box>
                <Button
                  color="success"
                  size="small"
                  onClick={() => handleRespondJoinRequest(data._id, WaitingListStatus.Accepted)}
                  startIcon={<DoneIcon/>}>
                  Accept
                </Button>
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleRespondJoinRequest(data._id, WaitingListStatus.Rejected)}
                  startIcon={<CancelIcon/>}
                  sx={{ml: 2}}>
                  Reject
                </Button>
              </Box>
          )}
        </>
      )
    }]
  }, [])

  useEffect(() => {
    dispatch(fetchSchoolStudentsThunk(schoolId))
    dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
  }, [schoolId])

  const handleCancelInvitation = (invitation: typeof waitingList[0]) => {
    cancelInvitation({
      variables: {
        invitationId: invitation.id
      }
    }).then(() => {
      pendingInvitationsQuery.refetch()
      dispatch(notifyUser({
        message: customNotifications.INVITATION_CANCELED_SUCCESS
      }))
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  const handleRespondJoinRequest = (id: string, decision: WaitingListStatus.Accepted | WaitingListStatus.Rejected) => {
    respondJoinRequest({
      variables: {
        waitingListId: id,
        decision
      }
    }).then(() => {
      dispatch(fetchAvailableClassroomsThunk({schoolId}))
      dispatch(fetchSchoolStudentsThunk(schoolId))
      dispatch(fetchStudentsForClassThunk({classroomId: classroom._id}))
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  return (
    <Box position="relative">
      {waitingList?.length > 0 && (
        <Box mt={1} mb={2}>
          <Paper variant="outlined" sx={{p: 2}}>
            <Typography color="textPrimary" variant="h6">
              Waiting List
            </Typography>
            <Box>
              <CustomSearchTable
                rows={waitingList}
                rowsPerPageOption={50}
                tableSchema={waitingListTableSchema}
                loading={pendingInvitationsQuery.loading}
                searchFields={["user.email", "user.firstName", "user.lastName"]}
              />
              <ConfirmationAlert
                isOpen={!!invitationToCancel}
                setOpen={() => setInvitationToCancel(null)}
                handleConfirm={() => handleCancelInvitation(invitationToCancel)}
                handleCancel={() => setInvitationToCancel(null)}
                dialogTitle="Are you sure you want to cancel invitation?"
                cancelText="No"
                confirmText={{color: "error", text: "Yes"}}
              />
            </Box>
          </Paper>
        </Box>
      )}
      <Box mb={4}>
        <Paper variant="outlined" sx={{p: 2}}>
          <Typography color="textPrimary" variant="h6" mb={2}>
            Enrolled Students
          </Typography>
          <ManageStudentsWithAssignPT
            classroom={classroom}
            onInvitationUpdate={() => {
              pendingInvitationsQuery.refetch()
            }}
          />
        </Paper>
      </Box>
    </Box>
  )
}
