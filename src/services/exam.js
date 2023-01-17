import apiCall from "api/rest"
import {ENDPOINT} from "consts/endpoints"

function get() {
  return apiCall({
    url: `${ENDPOINT.practiceVoucher}`,
    // url: `https://dev.certify.knowledge-pillars.com/api/testing/vouchers`,
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

function getUserExamScore() {
  return apiCall({
    url: `${ENDPOINT.userExamsScrore}`,
    method: "GET"
  })
}

const ExamService = {
  get,
  getById,
  getUserExamScore,
  getExamStudentAccess
}

export default ExamService
