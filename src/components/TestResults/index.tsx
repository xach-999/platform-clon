import Filters, {
  defaultValues as additionalFiltersDefaultValues,
  FiltersValue as AdditionalFiltersValue
} from "./components/Filters"
import React, {useEffect, useMemo, useState} from "react"
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
  Chip,
  Stack,
  Button
} from "@mui/material"
import Scrollbar from "components/Scrollbar"
import {useDispatch, useSelector} from "store"
import {
  fetchPracticeSessionsBySchoolThunk,
  fetchSessionsBySchoolThunk
} from "store/slices/practiceSession/practiceSession"
import useSearchInput from "hooks/useSearchInput"
import {
  cancelExamSessionThunk,
  getExamCodesHavePracticeSessionsThunk,
  getExamCodesHaveSessionsThunk
} from "store/slices/exams"
import {
  examCodesHavePracticeSessionsForSelect,
  selectExamCodesForSelect,
  selectPracticeResultsBySchool,
  selectResultsBySession
} from "store/slices/schoolSlice/selectors"
import {useLocation, useNavigate} from "react-router-dom"
import StudentResultsTable from "components/StudentResultsTable"
import PracticeResultsActionsMenu from "components/PracticeResultsActionsMenu"
import {
  fetchAvailableClassroomsThunk,
  fetchTestingGroupsThunk
} from "store/slices/schoolSlice/schoolSlice"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import fromAbbrToWords from "consts/fromAbbrToWords"

export type IStudentResultItem = {
  firstName: string
  lastName: string
  email: string
  score: number
  status: string
  id: string
}

interface Props {
  practice?: boolean
  classroomId?: string
}

type LocationState = {
  groupId?: string
  groupName?: string
}

type FiltersValue = {
  classroomId: string
  examCode: string
} & AdditionalFiltersValue

export default function TestResults({practice, classroomId}: Props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const location = useLocation()
  const {groupId, groupName} = location.state as LocationState | null || {}

  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false)
  const [filters, setFilters] = useState<FiltersValue>({
    classroomId: classroomId || "",
    examCode: "",
    ...additionalFiltersDefaultValues
  })

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const classrooms = useSelector((store) => store.schoolSlice.availableClassrooms)
  const examCodes = useSelector(selectExamCodesForSelect)
  const practiceExamCodes = useSelector(examCodesHavePracticeSessionsForSelect)
  const examResults = useSelector(selectResultsBySession)
  const practiceResults = useSelector(selectPracticeResultsBySchool)
  const practiceLoading = useSelector((store) => store.practiceSession.loading)
  const schoolLoading = useSelector((store) => store.schoolSlice.loading)
  const cancelingSession = useSelector((store) => store.examsSlice.cancelingSession)
  const testingGroups = useSelector((store) => {
    const groups = store.schoolSlice.testingGroups

    if (!groups?.length) return null

    return groups.map((group) => ({id: group.id, name: group.name}))
  })

  const isLoading = practiceLoading || schoolLoading

  const currentGroup = useMemo(() => {
    if (groupId && groupName) {
      return {
        id: groupId,
        name: groupName
      }
    } else {
      return groupId ? testingGroups.find(i => i.id === groupId) || null : null
    }
  }, [groupId, groupName])

  const examCodeOptions = useMemo(() => (
    practice ? practiceExamCodes : examCodes
  ), [practice, practiceExamCodes, examCodes])

  const classroomOptions = useMemo(() => (
    classrooms.map((item) => ({
      label: item.name,
      value: item._id
    }))
  ), [classrooms])

  const {SearchInputJSX, searchInput} = useSearchInput("Search Students")

  const filteredResults = useMemo(() => {
    if (!practice) {
      return examResults
    } else {
      return (practiceResults || []).filter(i =>
        filters.examCode ? i.examCode === filters.examCode : true
      ).filter(i =>
        filters.classroomId ? i.user?.classroomIds?.some(i => i === filters.classroomId) : true
      ).filter(i => {
        if (filters.passed) {
          if (filters.passed === "yes") return i.isPassed
          if (filters.passed === "no") return !i.isPassed
        }

        return true
      }).filter(i =>
        filters.showAnswers ? i.showResult === filters.showAnswers : true
      ).filter(i => {
        const date = new Date(
          i.createDate || i.startTime || i.createdAt
        ).setHours(0, 0, 0, 0)

        if (!filters.startDate && !filters.endDate) {
          return true
        }

        return (
          (filters.endDate ? filters.endDate >= date : true)
          && (filters.startDate ? filters.startDate <= date : true)
        )
      })
    }
  }, [practice, schoolId, examResults, practiceResults, filters])

  useEffect(() => {
    if (!schoolId) return

    dispatch(fetchAvailableClassroomsThunk({schoolId}))
    dispatch(fetchTestingGroupsThunk({schoolId}))

    if (practice) {
      dispatch(getExamCodesHavePracticeSessionsThunk(schoolId))
      return
    }

    dispatch(getExamCodesHaveSessionsThunk(schoolId))
  }, [schoolId, practice])

  useEffect(() => {
    if (!schoolId) return

    handleUpdateData()
  }, [practice, schoolId, currentGroup, filters])

  const handleMoreInfo = (result) => {
    const {_id, id} = result

    if (practice) {
      navigate(`/practice-results/exam-details/${id || _id}`)
      return
    }

    navigate(`/my-results/exam-details/${id || _id}`)
  }

  const handleUpdateData = () => {
    if (!schoolId) {
      return
    } else if (practice) {
      dispatch(fetchPracticeSessionsBySchoolThunk(schoolId))
    } else {
      dispatch(fetchSessionsBySchoolThunk({
        schoolId,
        examCode: filters.examCode,
        groupId: currentGroup?.id,
        classroomId: filters.classroomId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.passed && {
          isPassed: filters.passed === "yes"
        })
      }))
    }
  }

  const handleCancelSession = async (sessionId) => {
    await dispatch(cancelExamSessionThunk(sessionId))

    handleUpdateData()
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            {SearchInputJSX}
          </Box>
          {currentGroup?.id && (
            <Box>
              <Chip
                label={["Results For", currentGroup?.name || "Group"].join(" ")}
                variant="filled"
                onDelete={() => {
                  navigate(location.pathname, {
                    replace: true
                  })
                }}
              />
            </Box>
          )}
          {!currentGroup && !classroomId && classroomOptions && (
            <Box>
              <FormControl variant="filled" sx={{minWidth: 130}}>
                <InputLabel id="select-class">Classroom</InputLabel>
                <Select
                  variant="outlined"
                  labelId="select-class"
                  name="schoolClass"
                  value={filters.classroomId || ""}
                  onChange={(e) => {
                    setFilters(current => ({
                      ...current,
                      classroomId: e.target.value
                    }))
                  }}>
                  {[
                    <MenuItem key="all" value="">
                      <em>All classrooms</em>
                    </MenuItem>,
                    ...classroomOptions.map(({label, value}, num) => {
                      return (
                        <MenuItem key={`${label}-${num}`} value={value}>
                          {label}
                        </MenuItem>
                      )
                    })
                  ]}
                </Select>
              </FormControl>
            </Box>
          )}
          {!currentGroup && examCodeOptions && (
            <Box>
              <FormControl sx={{minWidth: 130}} variant="filled">
                <InputLabel id="select-exam-code">Exam Code</InputLabel>
                <Select
                  variant="outlined"
                  labelId="select-exam-code"
                  name="examCode"
                  value={filters.examCode || ""}
                  onChange={(e) => {
                    setFilters(current => ({
                      ...current,
                      examCode: e.target.value
                    }))
                  }}>
                  {[
                    <MenuItem key="all" value="">
                      <em>All exams</em>
                    </MenuItem>,
                    ...examCodeOptions.map(
                      ({label, value}, num) => {
                        return (
                          <MenuItem key={`${label}-${num}`} value={value}>
                            {`${label} - ${fromAbbrToWords[value]}`}
                          </MenuItem>
                        )
                      }
                    )
                  ]}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        <Box>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => {
                setShowAdditionalFilters(!showAdditionalFilters)
              }}>
              {showAdditionalFilters ? (
                <ExpandLessIcon/>
              ) : (
                <ExpandMoreIcon/>
              )}
              {showAdditionalFilters ? "Less" : "More"} Filters
            </Button>
            <PracticeResultsActionsMenu
              results={filteredResults}
              searchInput={searchInput}
              groupName={currentGroup?.name}
              exportQuery={{
                type: practice ? "practice" : "exam",
                schoolId,
                classroomId: filters.classroomId,
                groupId: currentGroup?.id,
                examCode: filters.examCode,
                startDate: filters.startDate,
                endDate: filters.endDate
              }}
            />
          </Stack>
        </Box>
      </Box>
      <Filters
        open={showAdditionalFilters}
        practice={practice}
        currentGroup={currentGroup}
        onChange={value => {
          setFilters(current => ({
            ...current,
            ...value
          }))
        }}
      />
      <Box minHeight="4px">
        {isLoading && (
          <LinearProgress color="primary"/>
        )}
      </Box>
      <Scrollbar>
        <StudentResultsTable
          results={filteredResults}
          rowsPerPageProp={100}
          loading={isLoading}
          cancelingSession={cancelingSession}
          searchInput={searchInput}
          handleMoreInfoClick={handleMoreInfo}
          isPractice={practice}
          handleCancelSessionClick={handleCancelSession}
        />
        {!filteredResults?.length && !isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} minHeight="46vh">
            <Typography variant="h5">
              No Results available
            </Typography>
          </Box>
        )}
      </Scrollbar>
    </Box>
  )
}
