import {useMemo} from "react"
import fromAbbrToWords from "consts/fromAbbrToWords"

const useExamFullName = (params) => {
  return useMemo(() => {
    if (!params?.examName) return ""
    let result = ""
    let abbr = params.examName.split("-")
    if (abbr && abbr[1]) result = fromAbbrToWords[abbr[1].toUpperCase()]
    return result ? result : ""
  }, [params])
}

export default useExamFullName
