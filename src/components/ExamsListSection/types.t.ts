import {OneExamType} from "types/services/practiceSession.service.t"
import {VouchersListType} from "types/services/vouchers.service.t"

export type ExamStartActivateHandlerType = (examItem: OneExamType) => void

export interface ExamsListSectionProps {
  onStartExam: ExamStartActivateHandlerType
  onActivateExam: ExamStartActivateHandlerType
}

export interface ExamItemProps extends ExamsListSectionProps {
  examItem: OneExamType
}

export interface ExamsListProps extends ExamsListSectionProps {
  examsList: VouchersListType
}
