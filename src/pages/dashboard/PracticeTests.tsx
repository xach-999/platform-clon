import {Helmet} from "react-helmet-async"
import {Box, Container, Grid} from "@mui/material"
import useSettings from "hooks/useSettings"
import ExamsListSection from "components/ExamsListSection"
import React, {useEffect} from "react"
import {useDispatch} from "react-redux"
import {ExamStartActivateHandlerType} from "components/ExamsListSection/types.t"
import {LINKS} from "consts/links"
import {useNavigate} from "react-router"
import {
  getAllVouchers,
  setCurrentVoucher
} from "store/slices/practiceVouchers/practiceVouchers"
import CustomBreadcrumbs from "components/CustomBreadcrumbs"
import useMainPageLink from "hooks/useMainPageLink"

export default function PracticeTests() {
  const {settings} = useSettings()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {mainPageLink} = useMainPageLink()

  useEffect(() => {
    dispatch(getAllVouchers())
  }, [dispatch])

  const onActivateExam: ExamStartActivateHandlerType = (examItem) => {
    dispatch(setCurrentVoucher(examItem))
    navigate(`/practice-tests${LINKS.addExamByVoucher}/${examItem.examName}`)
  }
  const onStartExam: ExamStartActivateHandlerType = (examItem) => {
    dispatch(setCurrentVoucher(examItem))
    navigate(`${LINKS.selectExamMode}/${examItem?.id}-${examItem.examCode}`)
  }

  return (
    <>
      <Helmet>
        <title> My Practice Tests | KP Platform</title>
      </Helmet>
      <Box bgcolor="background.default" minHeight="100%" py={3}>
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Grid container justifyContent="space-between">
            <CustomBreadcrumbs
              breadcrumbs={[{
                text: "Dashboard",
                path: mainPageLink
              }, {
                text: "My Practice Tests"
              }]}
              title="My Practice Tests"
            />
            <ExamsListSection
              onStartExam={onStartExam}
              onActivateExam={onActivateExam}
            />
          </Grid>
        </Container>
      </Box>
    </>
  )
}
