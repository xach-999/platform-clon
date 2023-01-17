import React, {useEffect} from "react"
import {useDispatch} from "react-redux"
import ExamsListSection from "components/ExamsListSection"
import GreetingSection from "./components/GreetingSection"
import {Box, Container} from "@mui/material"
import useSettings from "hooks/useSettings"
import {Helmet} from "react-helmet-async"
import {
  getAllVouchers,
  setCurrentVoucher
} from "store/slices/practiceVouchers/practiceVouchers"
import {ExamStartActivateHandlerType} from "components/ExamsListSection/types.t"
import {useNavigate} from "react-router"
import {LINKS} from "consts/links"

export default function Index() {
  const dispatch = useDispatch()
  const {settings} = useSettings()
  const navigate = useNavigate()

  const onActivateExam: ExamStartActivateHandlerType = (examItem) => {
    // dispatch(setCurrentVoucher(examItem))
    navigate(`${LINKS.addExamByVoucher}/${examItem.examName}`)
  }
  const onStartExam: ExamStartActivateHandlerType = (examItem) => {
    dispatch(setCurrentVoucher(examItem))
    navigate(`${LINKS.selectExamMode}/${examItem?.id}-${examItem.examCode}`)
  }

  useEffect(() => {
    dispatch(getAllVouchers())
  }, [])

  return (
    <>
      <Helmet>
        <title>Overview | KP Platform</title>
      </Helmet>
      <Box pt={3} pb={8} minHeight="100%">
        <Container maxWidth={settings.compact ? "xl" : false}>
          <GreetingSection/>
          <Box mt={3}>
            <ExamsListSection
              onActivateExam={onActivateExam}
              onStartExam={onStartExam}
            />
          </Box>
        </Container>
      </Box>
    </>
  )
}
