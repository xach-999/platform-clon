import {format} from "date-fns"
import {RootState} from "store"
import {
  IExamCodeForSelectItem,
  ILicenseForSelect,
  ILicenseItem,
  ISelectOptionTeacher,
  ISerializedTeacherItem,
  IVoucherItem
} from "types/common"

interface ISelectorFunction<T> {
  (state: RootState): T
}

const flatObjectFields = (inputArr: Array<any>, fields: string[]) => {
  return inputArr.reduce((acc, val) => {
    if (!val) return acc
    let finalObject = {...val}

    fields?.forEach((fieldName) => {
      if (!val[fieldName] || typeof val[fieldName] !== "object") return
      finalObject = {...val[fieldName], ...finalObject}
    })
    acc.push(finalObject)
    return acc
  }, [])
}

const reduceExamItems = (arrayOfExams: Array<string | { displayCode: string, code: string }>) => {
  return arrayOfExams.map<IExamCodeForSelectItem>((item) => {
    return {
      label: typeof item === "string" ? item : item.displayCode,
      value: typeof item === "string" ? item : item.code
    }
  })
}

export const getLicensesSelector: ISelectorFunction<ILicenseItem[]> = (state) => {
  const licensesDraft = state.schoolSlice.licenses

  if (!licensesDraft?.length) return null

  return licensesDraft.map((license) => {
    let examCodesToSet = license?.examCodes || []

    return {
      ...license,
      examCodes: examCodesToSet,
      code: license?.code ? license.code.toString() : "",
      // Not sure if license have examCode –Alex
      examCode: license.examCode,
      expirationDate: license.expirationDate
        ? format(new Date(license.expirationDate), "dd MMM yyyy")
        : ""
    }
  })
}

export const getSchoolVouchersSelector: ISelectorFunction<IVoucherItem[]> = (state) => {
  const vouchers = state.practiceVouchers.currentSchoolVouchers

  return vouchers?.length ? vouchers.map((el) => {
    let expDate = null
    if (el?.expirationDate) {
      expDate = format(new Date(el?.expirationDate), "dd MMM yyyy")
    }

    return {
      ...el,
      expirationDate: expDate,
      retakeAvaillable: el.retakeAvaillable ? "Yes" : "No"
    }
  }) : []
}

export const selectLicensesForSelect: ISelectorFunction<ILicenseForSelect[]> = (store) => {
  const licenses = store.schoolSlice.licenses

  if (!licenses) return null

  return licenses.reduce<ILicenseForSelect[]>((acc, item) => {
    const obj: ILicenseForSelect = {
      label: item.name,
      value: item.id,
      examCodes: item.examCodes,
      productType: item.productType
    }

    acc.push(obj)

    return acc
  }, [])
}

export const selectExamCodesForSelect: ISelectorFunction<IExamCodeForSelectItem[]> = (store) => {
  const exams: { code: string, displayCode: string, displayName: string }[] =
    store.examsSlice.examCodesHaveSessions

  if (!exams) return null

  return exams.reduce<IExamCodeForSelectItem[]>((acc, exam) => {
    const obj: IExamCodeForSelectItem = {
      label: exam.displayCode,
      value: exam.code
    }
    acc.push(obj)
    return acc
  }, [])
}

export const examCodesHavePracticeSessionsForSelect: ISelectorFunction<IExamCodeForSelectItem[]> = (store) => {
  if (!store.examsSlice.examCodesHavePracticeSessions?.length) return null

  return reduceExamItems(store.examsSlice.examCodesHavePracticeSessions)
}

export const selectAllExamCodesForSelect: ISelectorFunction<IExamCodeForSelectItem[]> = (store) => {
  if (!store.examsSlice.availableExamCodes) return null

  return reduceExamItems(store.examsSlice.availableExamCodes)
}

export const selectResultsBySession: ISelectorFunction<any[]> = (store) => {
  if (!store.practiceSession.examResults?.length) return null

  const results = flatObjectFields(store.practiceSession.examResults, [
    "result",
    "options"
  ])
  if (!results?.length) return null
  return results
}

export const selectPracticeResultsBySchool: ISelectorFunction<any[]> = (
  store
) => {
  if (!store.practiceSession.practiceResultsBySchool?.length) return null
  const results = flatObjectFields(
    store.practiceSession.practiceResultsBySchool,
    ["result", "options"]
  )
  if (!results?.length) return null
  return results
}

export const selectTeachers: ISelectorFunction<
  Array<ISerializedTeacherItem>
> = (state) => {
  const teachers = state.schoolSlice.teachers

  if (!teachers?.length) return null

  return teachers.map((teacher) => ({
    ...teacher,
    isProctor: teacher.isProctor ? "Yes" : "No",
    isAdmin: teacher.role === "admin" ? "Yes" : "No"
  }))
}

export const selectTeachersAndProctorsForSelectOptions: ISelectorFunction<{
  teachersOptions: ISelectOptionTeacher[]
  proctorOptions: ISelectOptionTeacher[]
}> = (state) => {
  const teachers = state.schoolSlice.teachers

  if (!teachers?.length)
    return {
      proctorOptions: null,
      teachersOptions: null
    }

  const serializedProctors: ISelectOptionTeacher[] = []
  const serializedTeachers: ISelectOptionTeacher[] = []

  teachers.forEach((item) => {
    const teacherOptionObject: ISelectOptionTeacher = {
      label: item.email,
      value: item.cognitoUserId
    }
    if (item.isProctor) serializedProctors.push(teacherOptionObject)
    serializedTeachers.push(teacherOptionObject)
  })

  return {
    proctorOptions: serializedProctors,
    teachersOptions: serializedTeachers
  }
}
