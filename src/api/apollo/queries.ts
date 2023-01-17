import {gql} from "@apollo/client"

export const GET_USER = gql`
  query Me {
    me {
      _id
      id: _id
      username
      studentId
      schoolId
      firstName
      lastName
      photoUrl
      proctorSignedAt
      role
      email
      country
      city
      postcode
      address
      birthdate
      phone
      isProctor
      classroomIds
      classrooms {
        _id
        createdAt
        updatedAt
        name
        school {
          _id
          name
        }
        assignedTeachers
        teachers {
          _id
          username
          email
          firstName
          lastName
          phone
        }
        createdBy
      }
      invitations {
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
      waitingList {
        _id
        createdAt
        updatedAt
        status
        failedReason
        decidedAt
        studentId
        classroomId
        classroom {
          _id
          createdAt
          updatedAt
          status
          name
          schoolId
          school {
            _id
            createdAt
            updatedAt
            name
            logo
          }
          teachers {
            _id
            createdAt
            updatedAt
            username
            firstName
            lastName
            email
            fullName
          }
        }
        student {
          _id
          username
          firstName
          lastName
          email
          fullName
          photoUrl
        }
      }
    }
  }
`

export const QUERY_TASK = gql`
  query Task($taskId: ID!) {
    getTask(taskId: $taskId) {
      displayName
      description
      validatorName
      practicalDetails {
        compilerId
        language
        template
        compilerId
        compilerVersionId
      }
      problem {
        id
        name
        body
        code
      }
    }
  }
`

export const GET_SCHOOL_CLASSROOMS = gql`
  query Classrooms($schoolId: ID, $includeArchived: Boolean) {
    classrooms(schoolId: $schoolId, includeArchived: $includeArchived) {
      items {
        _id
        createdAt
        updatedAt
        isArchived
        joinCode
        name
        school {
          _id
          createdAt
          updatedAt
          code
          name
          state
          city
          logo
        }
        status
        assignedTeachers
        createdBy
        students {
          total
          hasMore
        }
        teachers {
          _id
          username
          firstName
          lastName
        }
        waitingList {
          _id
          createdAt
          updatedAt
          status
          failedReason
          decidedAt
          studentId
          classroomId
          classroom {
            _id
            createdAt
            updatedAt
            status
            name
            schoolId
            school {
              _id
              createdAt
              updatedAt
              name
              logo
            }
            teachers {
              _id
              createdAt
              updatedAt
              username
              firstName
              lastName
              email
              fullName
            }
          }
          student {
            _id
            username
            firstName
            lastName
            email
            fullName
            photoUrl
          }
        }
      }
    }
  }
`

export const GET_SCHOOL_STUDENTS = gql`
  query GetSchool($schoolId: ID!) {
    getSchool(schoolId: $schoolId) {
      students {
        items {
          _id
          createdAt
          updatedAt
          cognitoUserId
          username
          studentId
          schoolId
          firstName
          lastName
          email
          country
          city
          postcode
          state
          address
          role
          birthdate
          phone
          classroomIds
          fullName
          photoUrl
          vouchers {
            _id
            createdAt
            updatedAt
            code
            createDate
            expirationDate
            examCode
            forTesting
            expired
          }
        }
        total
        hasMore
      }
    }
  }
`

export const GET_CLASSROOM = gql`
  query GetClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      _id
      createdAt
      updatedAt
      isArchived
      joinCode
      name
      school {
        _id
        createdAt
        updatedAt
        code
        name
        state
        city
        logo
      }
      status
      assignedTeachers
      createdBy
      students {
        items {
          _id
          createdAt
          updatedAt
          cognitoUserId
          username
          studentId
          schoolId
          firstName
          lastName
          email
          country
          city
          postcode
          state
          address
          role
          birthdate
          phone
          classroomIds
          fullName
          photoUrl
          vouchers {
            _id
            createdAt
            updatedAt
            code
            createDate
            expirationDate
            examCode
            forTesting
            expired
          }
        }
        total
        hasMore
      }
      teachers {
        _id
        username
        firstName
        lastName
      }
      waitingList {
        _id
        createdAt
        updatedAt
        status
        failedReason
        decidedAt
        studentId
        classroomId
        classroom {
          _id
          createdAt
          updatedAt
          status
          name
          schoolId
          school {
            _id
            createdAt
            updatedAt
            name
            logo
          }
          teachers {
            _id
            createdAt
            updatedAt
            username
            firstName
            lastName
            email
            fullName
          }
        }
        student {
          _id
          username
          firstName
          lastName
          email
          fullName
          photoUrl
        }
      }
    }
  }
`

export const GET_PENDING_INVITATIONS = gql`
  query ExampleQuery($classroomId: ID!) {
    getPendingInvitations(classroomId: $classroomId) {
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
