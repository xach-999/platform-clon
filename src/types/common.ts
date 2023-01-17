// ! Methods
import {Classroom, Invitation, User} from "generated/graphql"

export interface IServiceMethodFunc<ArgType = void, ReturnType = any> {
  (arg: ArgType): Promise<ReturnType>
}

// ! help types
export type ProductType = "practice test" | "exam"
export type ProctoringType = "practice test" | "exam"
export type PaymentType =
  | "License inventory"
  | "Voucher inventory"
  | "Student inventory"

// ! Testing Group
export interface ITestingGroupItem {
  id: string
  teacherUserId: string
  teacherName: string
  proctorUserId: string
  proctorName: string
  proctoring: "classroom" | "online"
  licenseId: string
  status: string
  licenseName: string
  isArchived: boolean
  examCode: string
  createdAt: number
  /** Virtual field */
  examDisplayCode?: string
  name: string
  code: string
  paymentType: PaymentType
}

export interface INewTestingGroup
  extends Pick<
    ITestingGroupItem,
    "teacherUserId" | "proctoring" | "licenseId" | "examCode" | "name"
  > {
  schoolId: string
  proctorUserId?: string
  paymentType: PaymentType
}

export interface ISerializedTestingGroupItem
  extends Omit<ITestingGroupItem, "isArchived" | "proctoring"> {
  isArchived: string
  proctoring: string
}

// ! School
export interface ISchoolItem {
  id: string
  code: string
  name: string
  state: string
  city: string
  logo: string
}

// ! License
export interface ILicenseItem {
  id: string
  schoolId: string
  name: string
  productType: ProductType
  proctoring: ProctoringType
  status: "active" | "inactive"
  code: number | string
  examCode: string
  examCodes: string[]
  expirationDate: string
  vouchersTotal: number
}

export interface ILicenseForSelect {
  label: ILicenseItem["code"]
  value: ILicenseItem["id"]
  examCodes: ILicenseItem["examCodes"]
  productType: ILicenseItem["productType"]
}

// ! Student
export interface IStudentItem extends User {
  _id: string
  groups: []
  studentId: string
  firstName: string
  lastName: string
  email: string
  username: string
  schoolId: string
  classroomIds: string[]
  assignedPracticeTests: string[]
  // For some reason there is value of `congnitoUserId` instead of `_id` – Alex
  id: string
  photoUrl: string
  picture: string
  fullName?: string
}

export interface ICheckboxStudentItem extends IStudentItem {
  checked: boolean
}

// ! Teacher
export interface ITeacherItem {
  // userId: string;
  _id: string
  id: string
  cognitoUserId: string
  firstName: string
  lastName: string
  email: string
  isProctor: boolean
  role: string
}

export interface ISelectOptionTeacher {
  label: ITeacherItem["email"]
  value: ITeacherItem["cognitoUserId"]
}

export interface ISerializedTeacherItem
  extends Omit<ITeacherItem, "isProctor"> {
  isProctor: string
}

// ! Voucher
export interface IVoucherItem {
  id: string
  schoolId: string
  productType: ProductType
  proctoring: ProctoringType
  retakeAvaillable: boolean
  licenseId: string
  userId: string
  code: string
  duration: number
  createDate: Date
  expirationDate: Date
  status: "availlable" | "assigned" | "used"
  examCode: string
  forTesting: boolean
}

// ! General
export interface IExamCodeForSelectItem {
  label: string
  value: string
}

export interface IUserInfo {
  id: string
  studentId: null
  schoolId: string
  username: string
  firstName: string
  lastName: string
  email: string
  groups: []
  country: string
  city: string
  postcode: string
  // address: string
  // birthdate: string
  // phone: string
  isProctor: boolean
  proctorSignedAt: string
  photoUrl: string
  classrooms: Classroom[]
  invitations: Invitation[]
}

export interface ISessionItem {
  id: string
  userId: string
  examCode: string
  status: string
  createDate: string
  type: string
  options: string
  tasks: Array<any>
}

export type IClassroomItem = Classroom

export interface IStudentClassroomItem {
  id: string
  name: string
  isRequest?: boolean
  decidedAt?: string
  teacher?: Partial<ITeacherItem>
  school: ISchoolItem
}
