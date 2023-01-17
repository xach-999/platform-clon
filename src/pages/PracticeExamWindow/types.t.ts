import {ReactNode} from "react"

type DiffTypeAnsType = {
  id: string
  position?: string
}

export type DefaultExamWindowProps = {
  setPopupType: (popupType: string) => void
  ref: ReactNode
  isFullScreen: boolean
  onFullButtonClick: () => void
  codeEditorData: string
  setCodeEditorData: (code: string) => void
  onRefresh: (data: string) => void
  // setInstructions: () => void;
}

export type taskAnswerType = {
  answers?: Array<object>
  sourceCode?: string
}

export type WorkSpacePropsType = {
  setDifferentTypeAnswers: (answers: DiffTypeAnsType) => void
  setKpCodeAnswer: (code: string) => void
  setRunDisabled: (runState: boolean) => void
  taskAnswer: taskAnswerType
  codeEditorData: string
  onNextClick?: () => void
  onRefresh?: (data: string) => void
  submitLoading?: boolean
  tasksAmount?: number
  currentTaskNumber?: number
  nextDisabled?: boolean
}

export type KPProblemType = {
  body: string
  category: number
  code: string
  id: number
  interactive: boolean
  name: string
}

export type PracticalDetailsType = {
  compilerId: number
  input: string
  language: string
  problemId: number
  template: string | null | undefined
}

export type SphereEnginePropsType = {
  question: {
    id: string
    practicalDetails: PracticalDetailsType
    problem: KPProblemType
    displayName: string
  }
  setKpCodeAnswer: (code: string) => void
  setRunDisabled: (isRunDisabled: boolean) => void
  codeEditorData: string
  onNextClick?: () => void
  onRefresh?: (data: string) => void
  submitLoading?: boolean
  tasksAmount?: number
  currentTaskNumber?: number
}
