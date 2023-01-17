import React from "react"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import BackdropLoad from "components/BackdropLoad"
import PrevNextSection from "components/PrevNextSection"
import {Typography} from "@mui/material"
import {NewSessionOptions} from "store/slices/practiceSession/practiceSession.t"
import {createNewSession} from "store/slices/practiceSession/practiceSession"
import {unwrapResult} from "@reduxjs/toolkit"
import {useNavigate, useParams} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import useMainPageLink from "hooks/useMainPageLink"

export default function AdditionalExamInfo() {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loading = useSelector((state) => state.practiceSession.loading)

  const {mainPageLink} = useMainPageLink()

  const realExamModeFunctionality = async () => {
    const voucherId = params.voucherId
    const type = "practice"
    const options: Partial<NewSessionOptions> = {
      showResult: "end"
    }

    try {
      const sessionResult = await dispatch(
        createNewSession({
          options,
          voucherId,
          type
        })
      )

      const normalizedSessionAnswer = unwrapResult(sessionResult)
      if (!normalizedSessionAnswer?.tasks?.length) return

      const currentSessionId = normalizedSessionAnswer?.id
      const examCode = normalizedSessionAnswer?.examCode
      const firstTaskId = normalizedSessionAnswer.tasks[0]?.id

      // localStorage.setItem("instructionsOpen", "true")
      navigate(`/exam-window/${examCode}/${currentSessionId}/${firstTaskId}`)
    } catch (e) {
      console.error(e)
    }
  }

  const handlePrev = () => {
    navigate(-1)
  }

  const handleNext = async () => {
    await realExamModeFunctionality()
  }

  return (
    <>
      <BackdropLoad open={loading} />
      <CardWithBreadcrumbs
        helmetTabTitle={"Additional Info"}
        pageTitle={"Additional Info"}
        breadcrumbs={[
          {
            path: mainPageLink,
            text: "Dashboard"
          },
          {
            path: null,
            text: "Additional Info"
          }
        ]}
      >
        <Typography
          variant={"h5"}
          color={"primary"}
          textAlign={"center"}
          mb={2}
        >
          To take this test in Real Test Mode, read the following:
        </Typography>
        <Typography variant={"subtitle1"} color={"primary"}>
          Tests administered in Real Test Mode closely simulate the actual
          testing environment. Students are timed and will not be able to
          request the answers and/or explanations to questions until after the
          test. Unlike tests taken in Practice Test Mode, this test mode will
          not allow you to reconfigure any of the test environment settings. You
          will be directed to environment that closely resembles the actual
          certification exam testing environment.
        </Typography>
        <PrevNextSection
          handlePrev={handlePrev}
          handleNext={handleNext}
          disabledNext={loading}
        />
      </CardWithBreadcrumbs>
    </>
  )
}
