import {Box, LinearProgress, Typography} from "@mui/material"
import React, {useEffect} from "react"
import useSearchInput from "hooks/useSearchInput"
import {fetchSessionsBySchoolThunk} from "store/slices/practiceSession/practiceSession"
import {useDispatch, useSelector} from "store"
import {selectResultsBySession} from "store/slices/schoolSlice/selectors"
import Scrollbar from "components/Scrollbar"
import StudentResultsTable from "components/StudentResultsTable"
import {cancelExamSessionThunk} from "store/slices/exams"
import {useNavigate} from "react-router"
import PracticeResultsMenu from "components/PracticeResultsActionsMenu"

export default function ExamSessions({testingGroup}) {
  const dispatch = useDispatch()
  const nav = useNavigate()

  const {SearchInputJSX, searchInput} = useSearchInput("Search Students")

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const loading = useSelector((store) => store.practiceSession.loading)
  const examResults = useSelector(selectResultsBySession)
  const cancelingSession = useSelector((store) => store.examsSlice.cancelingSession)

  useEffect(() => {
    let interval = setInterval(() => {
      updateData()
    }, 30000)

    return () => clearInterval(interval)
  }, [testingGroup, schoolId])

  useEffect(() => {
    updateData()
  }, [testingGroup, schoolId])

  const updateData = () => {
    if (!schoolId || !testingGroup.id) return
    dispatch(
      fetchSessionsBySchoolThunk({
        schoolId,
        groupId: testingGroup.id
      })
    )
  }

  const handleMoreInfoClick = (result) => {
    const {_id, id} = result
    nav(`/my-results/exam-details/${id || _id}`)
  }

  const handleCancelSessionClick = async (sessionId) => {
    await dispatch(cancelExamSessionThunk(sessionId))
    updateData()
  }

  return (
    <Box position="relative">
      <Box mb={4} mt={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between">
          {SearchInputJSX}
          <PracticeResultsMenu
            results={examResults}
            searchInput={searchInput}
            groupName={testingGroup.name}
            exportQuery={{
              type: "exam",
              groupId: testingGroup.id,
              examCode: testingGroup.examCode,
              schoolId: testingGroup.schoolId
            }}
          />
        </Box>
        <Box minHeight="4px">
          {loading && <LinearProgress color="primary"/>}
        </Box>
        <Scrollbar>
          <StudentResultsTable
            results={examResults}
            rowsPerPageProp={100}
            loading={loading}
            cancelingSession={cancelingSession}
            searchInput={searchInput}
            handleMoreInfoClick={handleMoreInfoClick}
            handleCancelSessionClick={handleCancelSessionClick}
          />
          {!examResults?.length && !loading && (
            <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="46vh">
              <Typography variant={"h5"}>
                No Results available
              </Typography>
            </Box>
          )}
        </Scrollbar>
      </Box>
    </Box>
  )
}
