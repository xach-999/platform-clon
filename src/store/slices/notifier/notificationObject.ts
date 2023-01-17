import {format} from "date-fns"

export enum customNotifications {
  GROUP_ADD_SUCCESS = "GROUP_ADD_SUCCESS",
  STUDENT_ADD_SUCCESS = "STUDENT_ADD_SUCCESS",
  STUDENT_INVITED_SUCCESS = "STUDENT_INVITED_SUCCESS",
  INVITATION_CANCELED_SUCCESS = "INVITATION_CANCELED_SUCCESS",
  TEACHER_ADD_SUCCESS = "TEACHER_ADD_SUCCESS",
  TEACHER_UPDATE_SUCCESS = "TEACHER_UPDATE_SUCCESS",
  CREATE_CLASSROOM_SUCCESS = "CREATE_CLASSROOM_SUCCESS",
  UPDATE_CLASSROOM_SUCCESS = "UPDATE_CLASSROOM_SUCCESS",
  PASSWORD_UPDATE_SUCCESS = "PASSWORD_UPDATE_SUCCESS",
  USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS",
  GROUP_ARCHIVED_SUCCESS = "GROUP_ARCHIVED_SUCCESS",
  GROUP_UNARCHIVED_SUCCESS = "GROUP_UNARCHIVED_SUCCESS",
  GROUP_UPDATE_SUCCESS = "GROUP_UPDATE_SUCCESS",
  PROFILE_UPDATE_SUCCESS = "PROFILE_UPDATE_SUCCESS",
  NEW_VOUCHER_ACTIVATED = "NEW_VOUCHER_ACTIVATED",
  GROUP_DELETE_SUCCESS = "GROUP_DELETE_SUCCESS",
  STUDENT_DELETE_SUCCESS = "STUDENT_DELETE_SUCCESS",
  CLASS_DELETE_SUCCESS = "CLASS_DELETE_SUCCESS",
  FEATURE_NOT_READY = "FEATURE_NOT_READY",
  PROCTOR_REGISTRATION_SUCCESS = "PROCTOR_REGISTRATION_SUCCESS",
  NO_STUDENTS_CHOSEN = "NO_STUDENTS_CHOSEN",
  ASSIGN_PRACTICE_TEST_SUCCESS = "ASSIGN_PRACTICE_TEST_SUCCESS",
  STUDENT_TRANSFER_SUCCESS = "STUDENT_TRANSFER_SUCCESS"
}

// ? ADD
const addNotifications = {
  [customNotifications.CREATE_CLASSROOM_SUCCESS]: "Classroom added successfully",
  [customNotifications.STUDENT_ADD_SUCCESS]: "Student has been enrolled",
  [customNotifications.STUDENT_INVITED_SUCCESS]: "Student has been invited",
  [customNotifications.TEACHER_ADD_SUCCESS]: "Teacher has been added",
  [customNotifications.TEACHER_UPDATE_SUCCESS]: "Teacher has been updated",
  [customNotifications.GROUP_ADD_SUCCESS]: "Testing Group has been created",
  [customNotifications.NEW_VOUCHER_ACTIVATED]: "New voucher has been activated",
  [customNotifications.NO_STUDENTS_CHOSEN]: "Choose student first, please"
}

// ? UPDATE
const updateNotifications = {
  [customNotifications.UPDATE_CLASSROOM_SUCCESS]: "Classroom has been updated",
  [customNotifications.PASSWORD_UPDATE_SUCCESS]: "Password has been updated",
  [customNotifications.GROUP_UPDATE_SUCCESS]: "Group has been updated",
  [customNotifications.GROUP_ARCHIVED_SUCCESS]: "Group has been archived",
  [customNotifications.GROUP_UNARCHIVED_SUCCESS]: "Group has been unarchived",
  [customNotifications.PROFILE_UPDATE_SUCCESS]: "Profile has been updated",
  [customNotifications.USER_UPDATE_SUCCESS]: "Student has been updated",
  [customNotifications.ASSIGN_PRACTICE_TEST_SUCCESS]: "Practice test has been assigned",
  [customNotifications.STUDENT_TRANSFER_SUCCESS]: "Student has been transferred"
}

// ? DELETE
const deleteNotifications = {
  [customNotifications.PASSWORD_UPDATE_SUCCESS]: "Password has been  updated",
  [customNotifications.INVITATION_CANCELED_SUCCESS]: "Invitation canceled",
  [customNotifications.GROUP_UPDATE_SUCCESS]: "Group has been updated",
  [customNotifications.PROFILE_UPDATE_SUCCESS]: "Profile has been updated",
  [customNotifications.GROUP_DELETE_SUCCESS]: "Group has been deleted",
  [customNotifications.STUDENT_DELETE_SUCCESS]: "Student has been deleted",
  [customNotifications.CLASS_DELETE_SUCCESS]: "Class has been deleted"
}

// ? GENERAL NOTIFICATIONS
const generalNotifications = {
  [customNotifications.FEATURE_NOT_READY]: "Currently working on this feature",
  [customNotifications.PROCTOR_REGISTRATION_SUCCESS]: `You are now registered as a Proctor. Terms agreed on ${format(
    new Date(),
    "dd MMM yyyy"
  )}.`
}

export const notificationObject = {
  ...addNotifications,
  ...updateNotifications,
  ...deleteNotifications,
  ...generalNotifications
}
