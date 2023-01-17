import {IServiceMethodFunc, IVoucherItem} from "../common"
import {OneExamType} from "./practiceSession.service.t"

export type VouchersListType = Array<OneExamType>

export type IAssignPracticeTestBody = {
  examCode: string
  licenseCode?: string
  students: Array<string>
}

export interface IVoucherService {
  redeemVoucherByCode: IServiceMethodFunc<string, { data: OneExamType }>
  getAllVouchers: IServiceMethodFunc<void, VouchersListType>
  getVouchersBySchool: IServiceMethodFunc<string, IVoucherItem[]>
  fetchVoucherById: IServiceMethodFunc<string, OneExamType>
  validateVoucher: IServiceMethodFunc<{
    examCode: string
    voucherCode: string
  }>
  assignPracticeTest: IServiceMethodFunc<IAssignPracticeTestBody>
}
