import apiCall from "api/rest"
import {useEffect, useState} from "react"

export default function useKpEditor(question) {
  const [submissionId, setSubmissionId] = useState(null)
  const [compileAnswer, setCompileAnswer] = useState(null)
  const [runDisabled, setRunDisabled] = useState(false)

  useEffect(() => {
    setSubmissionId(null)
    setCompileAnswer(null)
    setRunDisabled(false)
  }, [question.id])

  useEffect(() => {
    if (!submissionId) return

    let intervalVar = null

    const retrieveSubmission = async () => {
      try {
        const res = await apiCall({
          url: `/sphere-engine/compilers/submissions/${submissionId}`,
          method: "GET"
        })

        setCompileAnswer(res?.data?.result)
        if (res?.data?.result?.status_code > 10) {
          clearInterval(intervalVar)
          setRunDisabled(false)
        }
      } catch (error) {
        setCompileAnswer({status_name: "something went wrong..."})
        clearInterval(intervalVar)
        setRunDisabled(false)
      }
    }

    intervalVar = setInterval(retrieveSubmission, 2000)
  }, [submissionId])

  const onRunCode = async (code) => {
    setRunDisabled(true)
    setCompileAnswer({status_name: "waiting to be compiled..."})

    try {
      const res = await apiCall({
        url: `/sphere-engine/compilers/submissions/task/${question.id}`,
        method: "POST",
        data: {
          source: code || " ",
          compilerId: question?.practicalDetails?.compilerId || "116",
          compilerVersionId: question?.practicalDetails?.compilerVersionId
        }
      })

      setSubmissionId(res?.data?.id)
    } catch (e) {
      setCompileAnswer({status_name: "something went wrong..."})
      setRunDisabled(false)
    }
  }

  return {
    compileAnswer,
    runDisabled,
    onRunCode
  }
}
