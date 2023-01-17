import React, {ChangeEvent, useMemo, useState} from "react"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Modal,
  Link, TableContainer
} from "@mui/material"
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions"
import {makeStyles} from "@mui/styles"
import RefreshIcon from "@mui/icons-material/Refresh"
import CircularProgress from "components/CircularProgress"
import {format} from "date-fns"

const useStyles = makeStyles((theme) => ({
  paginationRow: {
    "& .MuiTablePagination-spacer": {
      display: "none"
    }
  },
  date: {
    color: theme.palette.secondary.main
  },
  testType: {
    fontStyle: "italic",
    textAlign: "center",
    paddingBottom: "0.3rem"
  },
  img: {
    display: "flex",
    width: "32px"
  }
}))

interface Props {
  results: any
  rowsPerPageProp: number
  loading: boolean
  cancelingSession: boolean
  searchInput: string
  handleMoreInfoClick: (result: any) => void
  handleCancelSessionClick: (sessionId: string) => void
  isPractice?: boolean
  fullWidth?: boolean
}

const getNestedObject = (nestedObj, pathStr) => {
  const pathArr = pathStr.split(".")
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
    nestedObj
  )
}

export default function StudentResultsTable({
  results,
  rowsPerPageProp,
  searchInput,
  handleMoreInfoClick,
  handleCancelSessionClick,
  isPractice,
  cancelingSession,
  fullWidth
}: Props) {
  const s = useStyles()
  const {paginationRow, date} = s

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageProp || 5)
  const [restartSessionModalOpen, setRestartSessionModalOpen] = useState(false)
  const [restartSession, setRestartSession] = useState(null)

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event?.target?.value || "5", 10))
    setPage(0)
  }
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const {searchFields, headerTitles} = useMemo(() => {
    return {
      searchFields: ["user.studentId", "user.username"],
      headerTitles: [
        " ",
        "First Name",
        "Last Name",
        // "Email",
        "Exam time",
        "Status",
        "Score",
        "Passed",
        isPractice && "Show Answers",
        "Actions"
      ].filter(Boolean)
    }
  }, [])

  const paginatedRows: Array<any> = useMemo(() => {
    if (!results?.length) return []
    if (!searchInput || !searchFields?.length)
      return results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const lowerQuery = searchInput.toLowerCase()

    const queriedTeachers = results.filter((t, index) => {
      let isValid = false

      searchFields.forEach((sf) => {
        let valueToCheck = getNestedObject(t, sf)

        if (!valueToCheck) {
          console.log(
            `Field "${sf}" doesn\`t exists in table row object index ${index}!\nCheck "searchFields" prop!`
          )
          return
        }

        if (typeof valueToCheck !== "string") {
          valueToCheck = String(valueToCheck)
        }

        if (valueToCheck && valueToCheck.toLowerCase().includes(lowerQuery))
          isValid = true
      })

      return isValid
    })

    return queriedTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [results, page, rowsPerPage, searchInput, searchFields])


  return (
    <Box minWidth={700}>
      {!!results?.length && (
        <TableContainer className="scrollbar-hidden" sx={{position: "relative", width: "100%"}}>
          <Table style={{tableLayout: fullWidth ? "fixed" : "auto"}}>
            <TableHead>
              <TableRow>
                {headerTitles.map(i => {
                  const cellAlign = i === "Actions" ? "center" : "left"

                  return (
                    <TableCell key={i} align={cellAlign} sx={{whiteSpace: "nowrap"}}>
                      {i}
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows?.map((i, num) => {
                const key = i.id || i._id || num
                const status =
                  i.status === "proctor-review-in-progress"
                    ? "completed"
                    : i.status === "scoring-in-progress"
                    ? "scoring"
                    : i.status === "initiated"
                    ? "loading"
                    : i.status
                const createDate =
                  i.createDate || i.startTime || i.createdAt
                const onlyDateToDisplay = createDate
                  ? format(Date.parse(createDate), "MMMM dd, yyyy")
                  : "Unknown"
                const onlyTimeToDisplay = createDate
                  ? format(Date.parse(createDate), "hh:mm a")
                  : "Unknown"
                const isPassed = i.isPassed
                const accredibleCredentialId = i.accredibleCredentialId
                const isPassedFieldValueColor = i.isPassed
                  ? "success"
                  : "error"
                const resultScore = i.score || 0
                const user = i.user || {}
                const exam = i.exam || {}
                const firstName = user.firstName
                const lastName = user.lastName
                const practiceType = i.showResult === "end" ? "Exam simulator" : "Practice mode"
                const showAnswers = i.showResult === "end" ? "end of test" : "task level"

                return (
                  i.status !== "canceled" && (
                    <TableRow key={key}>
                      <TableCell>
                        <Box
                          alignItems="center"
                          display="flex"
                          sx={{
                            "& > img": {
                              flexShrink: 0,
                              height: 85,
                              width: 85
                            }
                          }}>
                          <img alt="Exam logo" src={`/examIcons/${i.examCode || "unknown"}.png`}/>
                          <Box ml={2}>
                            <Typography color="textPrimary" variant="subtitle2">
                              {exam.displayName || "Unknown"}
                            </Typography>
                            <Typography whiteSpace="nowrap">
                              <span className={date}>{onlyDateToDisplay}</span>
                            </Typography>
                            <Typography
                              color="textSecondary"
                              noWrap
                              variant="body2"
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {firstName || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {lastName || "Unknown"}
                      </TableCell>
                      {/* <TableCell>{user.email || "Unknown"}</TableCell> */}
                      <TableCell>
                        {" "}
                        <span className={date}>{onlyTimeToDisplay}</span>
                      </TableCell>
                      <TableCell>
                        {status || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {isPractice ? (
                          <Box>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                              align="right"
                              className={s.testType}>
                              {practiceType}
                            </Typography>
                          </Box>
                        ) : null}
                        <Box alignItems="center" display="flex" justifyContent="flex-start">
                          <Box mr={2}>
                            <Typography align="right" color="textPrimary" variant="subtitle2">
                              {resultScore}%
                            </Typography>
                            <Typography color="textSecondary" variant="body2">
                              Score
                            </Typography>
                          </Box>
                          <CircularProgress value={resultScore}/>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color={isPassedFieldValueColor}>
                          {isPassed && accredibleCredentialId ? (
                            <Link
                              target="_blank"
                              href={`https://www.credential.net/${accredibleCredentialId}`}
                              underline="always"
                              variant="body2"
                              fontSize="1rem">
                              <img
                                alt=""
                                className={s.img}
                                src="/static/blue-certificate.png"
                              />
                            </Link>
                          ) : isPassed ? (
                            "Yes"
                          ) : (
                            "No"
                          )}
                        </Typography>
                      </TableCell>
                      {isPractice && (
                        <TableCell>
                          {showAnswers}
                        </TableCell>
                      )}
                      <TableCell align="center" sx={{whiteSpace: "nowrap"}}>
                        {isPractice || i.endTime ? (
                          <Button onClick={() => handleMoreInfoClick(i)}>
                            View more
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<RefreshIcon/>}
                            color="error"
                            disabled={cancelingSession}
                            onClick={() => {
                              setRestartSessionModalOpen(true)
                              setRestartSession(i)
                            }}>
                            Restart session
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow className={paginationRow}>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50,
                    100,
                    {label: "All", value: -1}
                  ]}
                  colSpan={3}
                  count={Object.keys(results || [])?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {"aria-label": "rows per page"},
                    native: true
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={{
                    borderBottom: 0,
                    minWidth: "450px"
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
      <Modal
        open={restartSessionModalOpen}
        onClose={() => setRestartSessionModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: "20px",
            boxShadow: 24,
            p: 4
          }}>
          <Box textAlign="center">
            <Typography variant="h6">
              Delete exam session?
            </Typography>
          </Box>
          <Typography id="modal-modal-description" mb={3}>
            Are you sure you want to continue and delete the current exam
            session for student {restartSession?.user?.firstName} ?
          </Typography>
          <Box display="flex" justifyContent="center" columnGap="20px">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setRestartSessionModalOpen(false)
                handleCancelSessionClick(restartSession._id)
              }}
              sx={{
                letterSpacing: "1px"
              }}>
              Yes, delete it!
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setRestartSessionModalOpen(false)}
              sx={{
                letterSpacing: "1px"
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
