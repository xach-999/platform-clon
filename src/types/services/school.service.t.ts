import {
  ILicenseItem,
  INewTestingGroup,
  IClassroomItem,
  IServiceMethodFunc,
  IStudentItem,
  ITestingGroupItem
} from "../common"
import {INewStudent} from "components/ManageStudentList"

export interface IFetchSchoolServiceMethods {
  fetchAvailableSchools: IServiceMethodFunc
  fetchTestingGroups: IServiceMethodFunc<{
    schoolId: string
    showArchived: boolean
  }>
  fetchTestingGroupById: IServiceMethodFunc<string, ITestingGroupItem>
  fetchSchoolTeachers: IServiceMethodFunc<string>
  fetchSchoolStudents: IServiceMethodFunc<string, { data: IStudentItem[] }>
  fetchSchoolVouchers: IServiceMethodFunc<string, { data: IStudentItem[] }>
  fetchLicenses: IServiceMethodFunc<string, ILicenseItem[]>
  fetchLicensesByExamCode: IServiceMethodFunc<
    { schoolId: string, examCode: string },
    ILicenseItem[]
  >
  fetchSchoolClassrooms: IServiceMethodFunc<
    IfetchSchoolClassroomsInput,
    IClassroomItem[]
  >
  fetchClassroomStudents: IServiceMethodFunc<
    IFetchClassroomStudentsInput,
    IStudentItem[]
  >
}

export interface IfetchSchoolClassroomsInput {
  schoolId?: string
}

export interface IFetchClassroomStudentsInput {
  classroomId: string
}

export interface IAddSchoolServiceMethods {
  createNewClassroom: IServiceMethodFunc<{
    name: string
    schoolId: string
  }>
  createNewStudent: IServiceMethodFunc<INewStudent>
  batchNewStudents: IServiceMethodFunc<INewStudent[]>
  batchNewStudentsToClassroom: IServiceMethodFunc<{
    students: INewStudent[]
    classroomId: string
  }>
  createNewTeacher: IServiceMethodFunc<{ schoolId: string, email: string }>
  createTestingGroup: IServiceMethodFunc<INewTestingGroup, ITestingGroupItem>
}

export interface IDeleteSchoolServiceMethods {
  deleteSchoolTeacher: IServiceMethodFunc<{
    schoolId: string
    teacherId: string
  }>
  deleteStudent: IServiceMethodFunc<string>
  deleteTestingGroup: IServiceMethodFunc<string>
  deleteClassroom: IServiceMethodFunc<string>
}

export interface IUpdateSchoolServiceMethods {
  updateClassroom: IServiceMethodFunc<{
    id: string
    data: Partial<IClassroomItem>
  }>
  updateStudentPassword: IServiceMethodFunc<{
    password: string
    studentId: string
  }>
  updateStudent: IServiceMethodFunc<Partial<IStudentItem>>
  updateStudentInClass: IServiceMethodFunc<{
    studentId: string
    classroomId: string
    action: "ADD" | "REMOVE"
  }>
  updateTeacherInClass: IServiceMethodFunc<{
    teacherId: string
    classroomId: string
    action: "ADD" | "REMOVE"
  }>
  updateTestingGroup: IServiceMethodFunc<{
    updatedTestingGroup: any
    id: string
  }>
  updateTestingGroupArchive: IServiceMethodFunc<{
    groupId: string
    archive: boolean
  }>
  updateTestingGroupStatus: IServiceMethodFunc<{ id: string, status: string }>
}

export interface ISchoolService
  extends IFetchSchoolServiceMethods,
    IAddSchoolServiceMethods,
    IDeleteSchoolServiceMethods,
    IUpdateSchoolServiceMethods {}
