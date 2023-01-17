import apiCall from "api/rest"
import {ENDPOINT} from "consts/endpoints"
import {CreateSessionBodyI} from "store/slices/practiceSession/practiceSession.t"
import {IPracticeSessionService} from "types/services/practiceSession.service.t"

const PracticeSessionService: IPracticeSessionService = {
  getAllSessions: () => {
    return apiCall({
      url: "/testing/sessions",
      method: "GET"
    })
  },

  getPracticeSessionsBySchool: (schoolId) => {
    return apiCall({
      url: `${ENDPOINT.getPracticeSessionsBySchool}/${schoolId}`,
      method: "GET"
    })
  },

  getObjectives: (examCategory) => {
    return apiCall({
      url: `${ENDPOINT.getObjectives}${examCategory ? `/${examCategory}` : ""}`,
      method: "GET"
    })
  },

  getSessionInstanceWP(sessionId) {
    return apiCall({
      url: `/testing/sessions/${sessionId}/instance`,
      method: "GET"
    })
  },

  finishSessionExam: (sessionId) => {
    return apiCall({
      url: `${ENDPOINT.finishSessionExam}/${sessionId}/finish`,
      method: "POST"
    })
  },

  startSessionExam: (sessionId) => {
    return apiCall({
      url: `${ENDPOINT.finishSessionExam}/${sessionId}/start`,
      method: "POST"
    })
  },

  getTasksAnswers: (sessionId) => {
    return apiCall({
      url: `/answers/${sessionId}`,
      method: "GET"
    })
  },

  getSessionTasksStatus: (sessionId) => {
    return apiCall({
      url: `/session-tasks-status/testing/${sessionId}`,
      method: "GET"
    })
  },
  fetchSessionsBySchool: ({
    schoolId,
    examCode,
    groupId,
    classroomId,
    startDate,
    endDate,
    isPassed
  }) => {
    return apiCall({
      url: `/testing/exam-sessions/school/${schoolId}`,
      params: {
        examCode,
        groupId,
        classroomId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        isPassed: isPassed
      },
      method: "GET"
    })
  },

  fetchTask: ({taskId, sessionId}) => {
    return apiCall({
      url: `${ENDPOINT.getTask}/${sessionId}/select-task/${taskId}`,
      method: "GET"
    })
  },

  fetchSessionExamDetails: (sessionId) => {
    return apiCall({
      url: `${ENDPOINT.finishSessionExam}/${sessionId}`,
      method: "GET"
    })
  },

  addFlaggedTask: ({sessionId, taskId}) => {
    return apiCall({
      url: `/testing/sessions/${sessionId}/flag/${taskId}`,
      method: "POST"
    })
  },

  removeFlaggedTask: ({sessionId, taskId}) => {
    return apiCall({
      url: `/testing/sessions/${sessionId}/flag/${taskId}`,
      method: "DELETE"
    })
  },

  createNewSession: (options: CreateSessionBodyI) => {
    return apiCall({
      url: `${ENDPOINT.createNewSession}`,
      method: "POST",
      data: options
    })
  },

  submitPracticeTask: ({sessionId, taskId, body}) => {
    return apiCall({
      url: `${ENDPOINT.getTask}/${sessionId}/answer/${taskId}`,
      method: "POST",
      data: body || null
    })
  }
}

export default PracticeSessionService
