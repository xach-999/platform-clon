export type NewSessionBodySelect = "end" | "task"

export type NewSessionOptions = {
  duration: number
  objectives: Array<string>
  showResult: NewSessionBodySelect
}

export type CreateSessionBodyI = {
  voucherId: string
  type: string
  options: Partial<NewSessionOptions>
}

export type SubmitPTaskArgsBody = {
  sourcecode?: string
  answers?: Array<string>
}
