import client from "api/apollo"
import {CREATE_CLASSROOM} from "api/apollo/mutations"
import {GET_CLASSROOM, GET_SCHOOL_CLASSROOMS, GET_SCHOOL_STUDENTS} from "api/apollo/queries"
import {
  GetSchoolQuery,
  GetSchoolQueryVariables,
  Mutation,
  MutationAddClassroomArgs,
  Query,
  QueryGetClassroomArgs
} from "generated/graphql"
import apiCall from "api/rest"
import {ENDPOINT} from "consts/endpoints"
import {INewStudent} from "components/ManageStudentList"
import {IStudentItem} from "types/common"
import {
  IAddSchoolServiceMethods,
  IDeleteSchoolServiceMethods,
  IFetchSchoolServiceMethods,
  ISchoolService,
  IUpdateSchoolServiceMethods
} from "types/services/school.service.t"

const FetchSchoolServiceMethods: IFetchSchoolServiceMethods = {
  fetchAvailableSchools: () => {
    return apiCall({
      url: `${ENDPOINT.schools}`,
      method: "GET"
    })
  },
  fetchTestingGroups: ({schoolId, showArchived}) => {
    return apiCall({
      url: `${ENDPOINT.testingGroups}?schoolId=${schoolId}&showArchived=${showArchived}`,
      method: "GET"
    })
  },
  fetchTestingGroupById: (groupId) => {
    return apiCall({
      url: `${ENDPOINT.testingGroups}/${groupId}`,
      method: "GET"
    })
  },
  fetchSchoolTeachers: (schoolId) => {
    return apiCall({
      url: `${ENDPOINT.schools}/${schoolId}/teachers`,
      method: "GET"
    })
  },
  fetchSchoolStudents: async (schoolId) => {
    const {data} = await client.query<GetSchoolQuery, GetSchoolQueryVariables>({
      query: GET_SCHOOL_STUDENTS,
      fetchPolicy: "network-only",
      variables: {
        schoolId
      }
    })

    return {
      data: data.getSchool.students.items as unknown as IStudentItem[]
    }
  },
  fetchSchoolVouchers: (schoolId) => {
    return apiCall({
      url: `${ENDPOINT.students}?schoolId=${schoolId}`,
      method: "GET"
    })
  },
  fetchLicenses: (schoolId) => {
    return apiCall({
      url: `${ENDPOINT.license}?schoolId=${schoolId}`,
      method: "GET"
    })
  },
  fetchLicensesByExamCode: ({schoolId, examCode}) => {
    return apiCall({
      url: `${ENDPOINT.fetchLicensesByExamCode}/${schoolId}/exam/${examCode}`,
      method: "GET"
    })
  },
  fetchSchoolClassrooms: async (input) => {
    const {data} = await client.query<Query>({
      query: GET_SCHOOL_CLASSROOMS,
      fetchPolicy: "network-only",
      variables: {
        schoolId: input.schoolId,
        includeArchived: true
      }
    })

    return data.classrooms.items
  },
  fetchClassroomStudents: async ({classroomId}) => {
    const {data} = await client.query<Query, QueryGetClassroomArgs>({
      query: GET_CLASSROOM,
      fetchPolicy: "network-only",
      variables: {
        classroomId
      }
    })

    return data.getClassroom.students.items as unknown as IStudentItem[]
  }
}

const AddSchoolServiceMethods: IAddSchoolServiceMethods = {
  createNewClassroom: async (input) => {
    const {data} = await client.mutate<Mutation, MutationAddClassroomArgs>({
      mutation: CREATE_CLASSROOM,
      fetchPolicy: "network-only",
      variables: {
        newClassroomData: input
      }
    })

    return data.addClassroom
  },
  createNewStudent: (newStudent: INewStudent) => {
    return apiCall({
      url: `${ENDPOINT.students}`,
      method: "POST",
      data: newStudent
    })
  },
  batchNewStudents: (newStudents: INewStudent[]) => {
    return apiCall({
      url: `${ENDPOINT.batchStudents}`,
      method: "POST",
      data: newStudents
    })
  },
  batchNewStudentsToClassroom: ({classroomId, students}) => {
    return apiCall({
      url: `${ENDPOINT.batchStudentsToClass}/${classroomId}`,
      method: "POST",
      data: students
    })
  },

  createNewTeacher: ({email, schoolId}) => {
    return apiCall({
      url: `${ENDPOINT.schools}/${schoolId}/staff`,
      method: "POST",
      data: {email, role: "teacher"}
    })
  },

  createTestingGroup: (testingGroup) => {
    return apiCall({
      url: `${ENDPOINT.testingGroups}`,
      method: "POST",
      data: testingGroup
    })
  }
}

const DeleteSchoolServiceMethods: IDeleteSchoolServiceMethods = {
  deleteSchoolTeacher: ({schoolId, teacherId}) => {
    return apiCall({
      url: `${ENDPOINT.schools}/${schoolId}/staff/${teacherId}`,
      method: "DELETE"
    })
  },

  deleteStudent: (studentId: string) => {
    return apiCall({
      url: `${ENDPOINT.students}/${studentId}`,
      method: "DELETE"
    })
  },

  deleteTestingGroup: (groupId: string) => {
    return apiCall({
      url: `${ENDPOINT.testingGroups}/${groupId}/delete`,
      method: "POST"
    })
  },

  deleteClassroom: (classroomId: string) => {
    return apiCall({
      url: `${ENDPOINT.classrooms}/${classroomId}`,
      method: "DELETE"
    })
  }
}

const UpdateSchoolServiceMethods: IUpdateSchoolServiceMethods = {
  updateClassroom: ({id, data}) => {
    return apiCall({
      url: `${ENDPOINT.classrooms}/${id}`,
      method: "PUT",
      data
    })
  },
  updateStudentPassword: ({
    password,
    studentId
  }: {
    password: string
    studentId: string
  }) => {
    return apiCall({
      url: `${ENDPOINT.students}/${studentId}/password`,
      method: "PUT",
      data: {
        password
      }
    })
  },
  updateTestingGroup: ({updatedTestingGroup, id}) => {
    return apiCall({
      url: `${ENDPOINT.testingGroups}/${id}`,
      method: "PATCH",
      data: updatedTestingGroup
    })
  },
  updateStudent: (user) => {
    const {id, ...restUser} = user
    return apiCall({
      url: `${ENDPOINT.users}/${id}`,
      method: "PATCH",
      data: restUser
    })
  },
  updateStudentInClass: ({studentId, classroomId, action}) => {
    return apiCall({
      url: `${ENDPOINT.classrooms}/${classroomId}/students`,
      method: "PUT",
      data: {
        studentId,
        action
      }
    })
  },
  updateTeacherInClass: ({teacherId, classroomId, action}) => {
    return apiCall({
      url: `${ENDPOINT.classrooms}/${classroomId}/teachers`,
      method: "PUT",
      data: {
        teacherId,
        action
      }
    })
  },
  updateTestingGroupStatus: ({id, status}) => {
    return apiCall({
      url: `/testing-groups/${id}/${status}`,
      method: "PATCH"
    })
  },
  updateTestingGroupArchive: ({groupId, archive}) => {
    return apiCall({
      url: `${ENDPOINT.testingGroups}/${groupId}/archive?archived=${archive}`,
      method: "POST"
    })
  }
}

const SchoolService: ISchoolService = {
  ...FetchSchoolServiceMethods,
  ...AddSchoolServiceMethods,
  ...DeleteSchoolServiceMethods,
  ...UpdateSchoolServiceMethods
}

export default SchoolService
