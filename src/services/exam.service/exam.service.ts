import apiCall from "api/rest"
import {ENDPOINT} from "consts/endpoints"
import {IServiceMethodFunc} from "types/common"

function getUserExamScore() {
  return apiCall({
    url: `${ENDPOINT.userExamsScrore}`,
    method: "GET"
  })
}

function get() {
  return apiCall({
    url: `${ENDPOINT.practiceVoucher}`,
    // url: `https://dev.certify.knowledge-pillars.com/api/testing/vouchers`,
    method: "GET"
  })
}

const getAvailableExamCodes: IServiceMethodFunc<void, string[]> = () => {
  return apiCall({
    url: `${ENDPOINT.getAvailableExamCodes}`,
    method: "GET"
  })
}
const getExamCodesHavePracticeSessions: IServiceMethodFunc<string, string[]> = (
  schoolId
) => {
  return apiCall({
    url: `${ENDPOINT.getExamCodesHavePracticeSessions}/${schoolId}`,
    method: "GET"
  })
}

const getExamCodesHaveSessions = (schoolId: string) => {
  return apiCall({
    url: `${ENDPOINT.getExamCodesHaveSessions}/${schoolId}`,
    method: "GET"
  })
}

function getById(id) {
  return apiCall({
    url: `${ENDPOINT.examByProgramId}${id}`,
    method: "GET"
  })
}

function getExamStudentAccess(examCode) {
  return apiCall({
    url: `${ENDPOINT.examStudentAccess}${examCode}`,
    method: "GET"
  })
}

function fetchExamDetailsById(examId: string) {
  return apiCall({
    url: `${ENDPOINT.examSession}/${examId}/score`,
    method: "GET"
  })
}

function cancelExamSession(sessionId: string) {
  return apiCall({
    url: `${ENDPOINT.examSession}/${sessionId}/cancel`,
    method: "PATCH"
  })
}

const ExamService = {
  getExamCodesHaveSessions,
  getUserExamScore,
  fetchExamDetailsById,
  getById,
  get,
  getExamStudentAccess,
  getAvailableExamCodes,
  getExamCodesHavePracticeSessions,
  cancelExamSession
}

export default ExamService
