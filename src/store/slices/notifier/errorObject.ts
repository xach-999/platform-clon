interface IErrorObjectItem {
  message: string
  duration?: number
}

interface IErrorObject {
  [key: string]: IErrorObjectItem
}

export enum customErrors {
  CAN_NOT_SUBMIT = "CAN_NOT_SUBMIT",
  CAN_NOT_FETCH_ALL_VOUCHERS = "CAN_NOT_FETCH_ALL_VOUCHERS",
  CAN_NOT_FETCH_TASK = "CAN_NOT_FETCH_TASK",
  CAN_NOT_DELETE_TEACHER = "CAN_NOT_DELETE_TEACHER",
  CAN_NOT_FETCH_TEACHER = "CAN_NOT_FETCH_TEACHER",
  CAN_NOT_FETCH_LICENSES = "CAN_NOT_FETCH_LICENSES",
  CAN_NOT_FETCH_TESTING_GROUP = "CAN_NOT_FETCH_TESTING_GROUP",
  CAN_NOT_DELETE_GROUP = "CAN_NOT_DELETE_GROUP",
  CAN_NOT_FETCH_STUDENTS = "CAN_NOT_FETCH_STUDENTS",
  CAN_NOT_DELETE_STUDENT = "CAN_NOT_DELETE_STUDENT",
  CAN_NOT_DELETE_CLASS = "CAN_NOT_DELETE_CLASS",
  CAN_NOT_EDIT_GROUP = "CAN_NOT_EDIT_GROUP",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  ASSIGN_PRACTICE_TEST_FAILED = "ASSIGN_PRACTICE_TEST_FAILED",
  CANT_UPLOAD_FILE = "CANT_UPLOAD_FILE",
  CANT_LOAD_IFRAME = "CANT_LOAD_IFRAME",
}

const fetchErrorsObject: IErrorObject = {
  [customErrors.CAN_NOT_FETCH_ALL_VOUCHERS]: {message: "Can't get vouchers!"},
  [customErrors.CAN_NOT_FETCH_TASK]: {
    message: "Can't get task!"
  },
  [customErrors.CAN_NOT_FETCH_TEACHER]: {
    message: "Can't get teachers from server"
  },
  [customErrors.CAN_NOT_FETCH_STUDENTS]: {
    message: "Can't get students from server"
  },
  [customErrors.CAN_NOT_FETCH_TESTING_GROUP]: {
    message: "Can't get testing group from server"
  },
  [customErrors.INVALID_CREDENTIALS]: {
    message: "The credentials you have entered are invalid."
  },
  [customErrors.CANT_UPLOAD_FILE]: {
    message: "Can't upload file."
  },
  [customErrors.CANT_LOAD_IFRAME]: {
    message: "Unexpected Wordpress error. Something went wrong."
  }
}
const deleteErrorsObject: IErrorObject = {
  [customErrors.CAN_NOT_SUBMIT]: {message: "Can't submit this question"},
  [customErrors.CAN_NOT_DELETE_TEACHER]: {
    message: "Can't delete teacher"
  },
  [customErrors.CAN_NOT_DELETE_GROUP]: {
    message: "Can't delete group from server"
  },
  [customErrors.CAN_NOT_DELETE_STUDENT]: {
    message: "Can't delete student from server"
  },
  [customErrors.CAN_NOT_DELETE_CLASS]: {
    message: "Can't delete class from server"
  }
}
const updateErrorsObject: IErrorObject = {
  [customErrors.CAN_NOT_EDIT_GROUP]: {
    message: "Can't edit this group"
  },
  [customErrors.ASSIGN_PRACTICE_TEST_FAILED]: {
    message: "Can't assign practice test"
  }
}
const generalErrors: IErrorObject = {
  "Network Error": {
    message: "Unexpected error"
  },
  "User not exists": {
    message:
      "User with this email doesn't exist. Please ask the user to create first an account on platform.knowledge-pillars.com",
    duration: 5000
  }
}

export const errObject: IErrorObject = {
  ...fetchErrorsObject,
  ...deleteErrorsObject,
  ...generalErrors,
  ...updateErrorsObject
}
