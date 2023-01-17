export const proctoringOptionsInitial = [
  {
    label: "Classroom",
    value: "classroom"
  },
  {
    label: "Online Proctoring",
    value: "online"
  }
]
export const paymentTypeOptionsInitial = [
  {
    label: "License inventory",
    value: "License inventory"
  },
  /*{
    label: "Voucher inventory",
    value: "Voucher inventory",
  },*/
  {
    label: "Student inventory",
    value: "Student inventory"
  }
]

export const selectRowInitial = {
  teacherUserId: {
    name: "teacherUserId",
    label: "Teacher",
    value: "default",
    isError: false,
    options: [{label: "No teachers available", value: "default"}]
  },
  proctoring: {
    name: "proctoring",
    label: "Proctoring",
    value: "classroom",
    isError: false,
    options: proctoringOptionsInitial
  },
  proctorUserId: {
    name: "proctorUserId",
    label: "Proctor",
    value: "default",
    isError: false,
    options: [{label: "No proctors available", value: "default"}]
  },
  examCode: {
    name: "examCode",
    label: "Exam Code",
    value: "",
    isError: false,
    options: []
  },
  paymentType: {
    name: "paymentType",
    label: "Select Payment Type",
    value: "",
    isError: false,
    options: paymentTypeOptionsInitial
  },
  licenseId: {
    name: "licenseId",
    label: "License",
    value: "",
    isError: false,
    options: []
  }
}
