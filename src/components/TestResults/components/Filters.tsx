import React, {useCallback, useEffect, useState} from "react"
import {debounce} from "lodash"
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Stack,
  Grid,
  Divider,
  Collapse
} from "@mui/material"
import {useSelector} from "store"
import {useLocation, useNavigate} from "react-router-dom"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import TransitionGroup from "react-transition-group/TransitionGroup"

export type FiltersValue = {
  startDate: number | null
  endDate: number | null
  passed: string
  showAnswers: string
}

interface Props {
  open?: boolean
  practice?: boolean
  currentGroup: {
    id: string
    name: string
  } | null
  onChange: (value: FiltersValue) => void
}

export const defaultValues: FiltersValue = {
  startDate: null,
  endDate: null,
  passed: "",
  showAnswers: ""
}

export default function Filters({open, practice, currentGroup, onChange}: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const testingGroups = useSelector((store) => {
    const groups = store.schoolSlice.testingGroups

    if (!groups?.length) return null

    return groups.map((group) => ({id: group.id, name: group.name}))
  })

  const [startDate, setStartDate] = useState<number | null>(defaultValues.startDate)
  const [endDate, setEndDate] = useState<number | null>(defaultValues.endDate)
  const [passed, setPassed] = useState(defaultValues.passed)
  const [showAnswers, setShowAnswers] = useState<string>(defaultValues.showAnswers)

  useEffect(() => {
    onChange({
      startDate,
      endDate,
      passed,
      showAnswers
    })
  }, [startDate, endDate, passed, showAnswers])

  const createDebouncedDateHandler = useCallback((type: "start" | "end") => {
    return debounce((newValue: Date | null) => {
      if (+newValue < 0 || isNaN(+newValue)) {
        return
      }

      if (type === "start") {
        setStartDate(newValue
          ? new Date(newValue.setHours(0, 0, 0, 0)).getTime()
          : null
        )
      } else {
        setEndDate(newValue
          ? new Date(newValue.setHours(23, 59, 59, 999)).getTime()
          : null
        )
      }
    }, 1000, {leading: true, trailing: true})
  }, [])

  const handleStartDate = createDebouncedDateHandler("start")
  const handleEndDate = createDebouncedDateHandler("end")

  return (
    <TransitionGroup>
      {open ? (
        <Collapse>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Box>
                <Stack spacing={1} mb={2}>
                  <Divider textAlign="left">
                    <Typography variant="overline">Date</Typography>
                  </Divider>
                  <Stack direction={{md: "row", xs: "column"}} spacing={1}>
                    <DatePicker
                      label="Start"
                      value={startDate}
                      onChange={handleStartDate}
                      maxDate={endDate ? new Date(endDate) : null}
                      renderInput={props => (
                        <TextField {...props}/>
                      )}
                    />
                    <DatePicker
                      label="End"
                      value={endDate}
                      onChange={handleEndDate}
                      minDate={startDate ? new Date(startDate) : null}
                      renderInput={props => (
                        <TextField {...props}/>
                      )}
                    />
                  </Stack>
                </Stack>
                <Stack spacing={1} mb={2}>
                  <Divider textAlign="left">
                    <Typography variant="overline">
                      {practice ? "Practice Test Passed" : "Exam Passed"}
                    </Typography>
                  </Divider>
                  <FormControl fullWidth>
                    <InputLabel id="passed-select-label">
                      {practice ? "Practice Test Passed" : "Exam Passed"}
                    </InputLabel>
                    <Select
                      labelId="passed-select-label"
                      id="passed-select"
                      value={passed || ""}
                      label={practice ? "Practice Test Passed" : "Exam Passed"}
                      onChange={e => {
                        setPassed(e.target.value === "all" ? "" : e.target.value)
                      }}>
                      <MenuItem value="all">See all</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                {!practice && (
                  <Stack spacing={1} mb={2}>
                    <Divider textAlign="left">
                      <Typography variant="overline">
                        Testing group
                      </Typography>
                    </Divider>
                    <FormControl fullWidth>
                      <InputLabel id="testing-group-select-label">
                        Testing group
                      </InputLabel>
                      <Select
                        labelId="testing-group-select-label"
                        id="testing-group-select"
                        value={currentGroup?.id || ""}
                        label="Testing group"
                        onChange={e => {
                          navigate(location.pathname, {
                            replace: true,
                            state: {
                              groupId: e.target.value
                            }
                          })
                        }}>
                        {testingGroups?.map((i, num) => (
                          <MenuItem key={`${i.id}-${num}`} value={i.id}>
                            {i.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                )}
                {practice && (
                  <Stack spacing={1} mb={2}>
                    <Divider textAlign="left">
                      <Typography variant="overline">
                        Show Answers
                      </Typography>
                    </Divider>
                    <FormControl fullWidth>
                      <InputLabel id="show-answers-select-label">
                        Show Answers
                      </InputLabel>
                      <Select
                        labelId="show-answers-select-label"
                        id="show-answers-select"
                        value={showAnswers || ""}
                        label="Show Answers"
                        onChange={e => {
                          setShowAnswers(e.target.value === "all" ? "" : e.target.value)
                        }}>
                        <MenuItem value="all">See all</MenuItem>
                        <MenuItem value="task">task level</MenuItem>
                        <MenuItem value="end">end of test</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      ) : null}
    </TransitionGroup>
  )
}
