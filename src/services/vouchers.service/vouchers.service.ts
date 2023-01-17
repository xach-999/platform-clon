import apiCall from "api/rest"
import {ENDPOINT} from "consts/endpoints"
import {IVoucherService} from "types/services/vouchers.service.t"

const VoucherService: IVoucherService = {
  redeemVoucherByCode: (voucherCode) => {
    return apiCall({
      url: ENDPOINT.practiceVoucher,
      method: "POST",
      data: {
        code: voucherCode
      }
    })
  },
  getAllVouchers: () => {
    return apiCall({
      url: ENDPOINT.practiceVoucher,
      method: "GET"
    })
  },
  fetchVoucherById: (voucherId) => {
    return apiCall({
      url: `${ENDPOINT.practiceVoucher}/${voucherId}`,
      method: "GET"
    })
  },
  validateVoucher: ({examCode, voucherCode}) => {
    return apiCall({
      url: `${ENDPOINT.validatePaymentVoucher}examCode=${examCode}&voucherCode=${voucherCode}`,
      method: "GET"
    })
  },
  getVouchersBySchool: (schoolId) => {
    return apiCall({
      url: `${ENDPOINT.practiceVoucher}/school/${schoolId}`,
      method: "GET"
    })
  },
  assignPracticeTest: (requestBody) => {
    return apiCall({
      url: ENDPOINT.assignPracticeTests,
      method: "POST",
      data: requestBody
    })
  }
}

export default VoucherService
