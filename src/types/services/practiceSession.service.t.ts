import {IServiceMethodFunc, ISessionItem} from "../common"
import {CreateSessionBodyI} from "store/slices/practiceSession/practiceSession.t"
import {
  IMultSessionWithBody,
  TMultSessionArgs
} from "services/practiceSession.service/practiceSession.service.t"

export type OneExamType = {
  code: string
  duration: number
  createDate: string
  expirationDate: string
  examCode: string
  id: string
  expired: false
  examName: string
  examCat: string
  displayCode: string
}

export type OneSessionTaskStatus = {
  data: {
    taskId: string
    displayName: string
    description: string
    answered: false
    isAnswerCorrect: null | boolean
    flag: boolean
  }
}

export type tasksAnswers = {
  data: {
    answers: any
    createdAt: string
    id: string
    score: number
    sessionId: string
    taskId: string
    textAnswers: any
    updatedAt: string
    userId: string
    validated: boolean
    _id: string
  }
}

export interface IPracticeSessionService {
  getAllSessions: IServiceMethodFunc
  finishSessionExam: IServiceMethodFunc<string>
  startSessionExam: IServiceMethodFunc<string>
  getSessionInstanceWP: IServiceMethodFunc<string>
  getObjectives: IServiceMethodFunc<string | undefined>
  createNewSession: IServiceMethodFunc<CreateSessionBodyI>
  submitPracticeTask: IServiceMethodFunc<IMultSessionWithBody>
  fetchTask: IServiceMethodFunc<TMultSessionArgs, Array<OneExamType>>
  getTasksAnswers: IServiceMethodFunc<string, tasksAnswers>
  getSessionTasksStatus: IServiceMethodFunc<string, OneSessionTaskStatus>
  fetchSessionsBySchool: IServiceMethodFunc<
    {
      schoolId: string
      examCode?: string
      groupId?: string
      classroomId?: string
      startDate?: number
      endDate?: number
      isPassed?: boolean
    },
    { data: Array<ISessionItem>, count: number }
  >
  fetchSessionExamDetails: IServiceMethodFunc<string, Array<OneExamType>>
  addFlaggedTask: IServiceMethodFunc<TMultSessionArgs, Array<OneExamType>>
  removeFlaggedTask: IServiceMethodFunc<TMultSessionArgs, Array<OneExamType>>
  getPracticeSessionsBySchool: IServiceMethodFunc<string>
}
