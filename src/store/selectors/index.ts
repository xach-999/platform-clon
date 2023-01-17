import {RootState} from "../index"
import {VouchersListType} from "types/services/vouchers.service.t"

interface BaseSelectorType<T> {
  (state: RootState): T
}
interface OptionSelectorType<T, S> {
  (state: RootState, option?: S): T
}

export const sortedExamsListSelector: OptionSelectorType<
  VouchersListType,
  boolean
> = (state, isSwitch) => {
  const examsList = state.practiceVouchers.allVouchers
  if (!examsList) return null
  if (!isSwitch)
    return examsList
      .slice()
      .sort((a, b) => a - b)
      .filter((exam) => {
        return !exam.expired
      })
  return examsList.slice().sort((a, b) => a.expired - b.expired)
}
export const selectTaskDetails: BaseSelectorType<any> = (state) => {
  const currTask = state?.practiceSession?.currentTask || {}
  const {problem, task} = currTask
  const {
    answers,
    code,
    description,
    displayName,
    examCode,
    examSubObjectiveCode,
    id,
    multipleDetails,
    questions,
    type,
    practicalDetails
  } = task || {}
  return {
    problem,
    answers,
    code,
    description,
    displayName,
    examCode,
    examSubObjectiveCode,
    id,
    multipleDetails,
    questions,
    type,
    practicalDetails
  }
}
