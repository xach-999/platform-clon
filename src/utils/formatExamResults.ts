import format from "date-fns/format"
import fromAbbrToWords from "consts/fromAbbrToWords"

export const examNameReplacer = {
  python: "PCS - Python Coding Specialist",
  wordpress: "WCE – WordPress Certified Editor"
}

const getExamStatus = (status, isPassed) => {
  if (status === "canceled") {
    return "CANCELLED BY THE USER"
  }
  if (status === "proctor-review-in-progress") {
    return "Under Review"
  }
  if (isPassed) {
    return "PASSED"
  } else {
    return "FAILED"
  }
}

const getFormattedDate = (date, initiatedDate) => {
  return date
    ? format(new Date(date), "dd  MMMM yyyy")
    : format(new Date(initiatedDate), "dd  MMMM yyyy")
}

const mapCertificationData = (exams) => {
  return exams
    .filter((exam) => exam.score !== null)
    .reduce((acc, exam) => {
      const isWordpressExam = exam.name === "wordpress"
      const isPythonExam = exam.name === "python" || "pca" || "pcs"

      let certificationAbbreviation = isWordpressExam ? "WCE" : "Other"
      if (isPythonExam && exam?.displayCode)
        certificationAbbreviation = exam?.displayCode
      let imgUrl = `/examIcons/${exam.examCode || "unknown"}.png`
      const toPush = {
        name: fromAbbrToWords[exam.displayCode],
        certification: certificationAbbreviation,
        imgSrc: imgUrl,
        status: getExamStatus(exam.status, exam.isPassed),
        date: getFormattedDate(exam.date, exam.initiatedDate),
        score: exam.score,
        isPassed: exam.isPassed ? "Yes" : "No",
        id: exam?.id
      }
      acc.push(toPush)
      return acc
    }, [])
}

const serializeSessionsArray = (sessions) => {
  return sessions.map((item) => {
    const imgUrl = `/practiceDetailsIcons/${item?.examCode || "PCS"}.png`
    const dateToPass = item?.finishDate || item?.createDate

    return {
      name: item?.examName || "Unknown",
      certification: item?.examCode || "Unknown",
      imgSrc: imgUrl,
      status: item?.status?.length
        ? item.status[0].toUpperCase() + item.status.slice(1)
        : "Unknown",
      date: dateToPass
        ? getFormattedDate(dateToPass, new Date().toISOString())
        : "Unknown",
      score: item?.result?.score || 0,
      isPassed: item?.result?.isPassed ? "Yes" : "No",
      id: item?.id
    }
  })
}

export {mapCertificationData, serializeSessionsArray}
