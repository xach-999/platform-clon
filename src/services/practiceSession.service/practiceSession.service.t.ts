import {SubmitPTaskArgsBody} from "store/slices/practiceSession/practiceSession.t"

export interface TMultSessionArgs {
  sessionId: string
  taskId: string
}

export interface IMultSessionWithBody extends TMultSessionArgs {
  body?: SubmitPTaskArgsBody
}
