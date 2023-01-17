import {gql} from "@apollo/client"

export const UPDATE_MY_PASSWORD = gql`
  mutation UpdateMyPassword($newPassword: String!) {
    updateMyPassword(newPassword: $newPassword) {
      _id
    }
  }
`

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($createInvitationInput: CreateInvitationInput) {
    createInvitation(createInvitationInput: $createInvitationInput) {
      _id
      comment
      createdAt
      decidedAt
      updatedAt
      invitationSourceId
      status
      userId
      classroomId
      classroom {
        _id
        name
        school {
          _id
          name
        }
      }
    }
  }
`

export const DELETE_INVITATION = gql`
  mutation DeleteInvitation($invitationId: ID) {
    deleteInvitation(invitationId: $invitationId) {
      _id
      createdAt
      updatedAt
      status
      decidedAt
      userId
      invitationSourceId
      comment
      classroomId
      classroom {
        _id
        name
        school {
          _id
          name
        }
      }
    }
  }
`

export const RESPOND_INVITATION = gql`
  mutation RespondInvitation($decision: InvitationStatus!, $invitationId: ID!) {
    respondInvitation(decision: $decision, invitationId: $invitationId) {
      _id
      createdAt
      updatedAt
      status
      decidedAt
      userId
      invitationSourceId
      comment
      classroomId
      classroom {
        _id
        name
        school {
          _id
          name
        }
      }
    }
  }
`

export const JOIN_CLASSROOM = gql`
  mutation JoinClassroomByCode($joinCode: String!) {
    joinClassroomByCode(joinCode: $joinCode) {
      _id
    }
  }
`

export const DELETE_JOIN_REQUEST = gql`
  mutation DeleteJoinRequest($joinRequestId: ID!) {
    deleteJoinRequest(joinRequestId: $joinRequestId) {
      _id
      status
    }
  }
`

export const RESPOND_JOIN_REQUEST = gql`
  mutation RespondClassroomJoinRequest($decision: WaitingListStatus!, $waitingListId: ID!) {
    respondClassroomJoinRequest(decision: $decision, waitingListId: $waitingListId) {
      _id
    }
  }
`

export const CREATE_CLASSROOM = gql`
  mutation AddClassroom($newClassroomData: AddClassroomInput) {
    addClassroom(newClassroomData: $newClassroomData) {
      _id
    }
  }
`

export const LEAVE_CLASSROOM = gql`
  mutation LeaveClassroom($classroomId: ID!) {
    leaveClassroom(classroomId: $classroomId) {
      _id
    }
  }
`

export const ARCHIVE_CLASSROOM = gql`
  mutation ArchiveClassroom($classroomId: ID!, $archived: Boolean!) {
    archiveClassroom(classroomId: $classroomId, archived: $archived) {
      _id
    }
  }
`

export const SET_CLASSROOM_STATUS = gql`
  mutation SetClassroomStatus($classroomStatus: ClassroomStatus!, $classroomId: ID!) {
    setClassroomStatus(classroomStatus: $classroomStatus, classroomId: $classroomId) {
      _id
      status
    }
  }
`

export const UPDATE_USER_BY_ID = gql`
  mutation UpdateUserById($userPayload: UpdateUserPayload!, $userId: ID!) {
    updateUserById(userPayload: $userPayload, userId: $userId) {
      _id
    }
  }
`

export const MOVE_USER_TO_ANOTHER_CLASSROOM = gql`
  mutation MoveUserToAnotherClassroom($fromClassroom: ID!, $toClassroom: ID!, $userId: ID!) {
    moveUserToAnotherClassroom(fromClassroom: $fromClassroom, toClassroom: $toClassroom, userId: $userId) {
      _id
    }
  }
`
