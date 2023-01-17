import React, {ChangeEvent, useEffect, useMemo, useState} from "react"
import {
  Box,
  Card,
  CardHeader,
  LinearProgress,
  Table,
  TableBody,
  TableFooter,
  TablePagination,
  TableRow
} from "@mui/material"
import Scrollbar from "components/Scrollbar"
import {useDispatch, useSelector} from "store"
import {
  mapCertificationData,
  serializeSessionsArray
} from "utils/formatExamResults"
import useMediaQuery from "@mui/material/useMediaQuery"
import {useTheme} from "@mui/material"
import TableRowMobile from "./components/TableRowMobile"
import TableRowDesktop from "./components/TableRowDesktop"
import MoreMenu from "./components/MoreMenu"
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions"
import {fetchAllSessionsThunk} from "store/slices/practiceSession/practiceSession"
import {useLocation} from "react-router-dom"
import {useNavigate} from "react-router"
import {fetchResults} from "store/slices/results"

interface Exam {
  id: string
  name: string
  certification: string
  imgSrc: string
  status: string
  date: string
  score: number
  isPassed: string
}

export default function ExamsResults(props) {
  const location = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const isMobileOrSmallTablet = useMediaQuery(theme.breakpoints.down("lg"))

  const [userResults, setUserResults] = useState<Exam[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const resultsList: Exam[] = useSelector((state) => {
    if (location?.pathname && location.pathname.includes("practice-results")) {
      return state.practiceSession?.allSessions || []
    }
    return state.resultsSlice?.allResults || []
  })
  const resultsLoading: boolean = useSelector((state) => {
    if (location?.pathname && location.pathname.includes("practice-results")) {
      return state.practiceSession.loading || false
    }
    return state.resultsSlice.loading || false
  })

  const isSessionResultsPage = useMemo(() => {
    if (!location?.pathname?.length) return false
    return location.pathname.includes("practice-results")
  }, [location?.pathname])

  const resultsArray = useMemo(() => {
    if (!resultsList?.length) return []
    return resultsList
  }, [resultsList])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event?.target?.value || "5", 10))
    setPage(0)
  }

  const onDetailsClick = (sessionId) => {
    nav(
      `/${
        isSessionResultsPage ? "practice-results" : "my-results"
      }/exam-details/${sessionId}`
    )
  }

  const displayResults = useMemo(() => {
    return userResults.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [userResults, page, rowsPerPage])

  useEffect(() => {
    setUserResults([])

    if (isSessionResultsPage) {
      dispatch(fetchAllSessionsThunk())
      return
    }

    dispatch(fetchResults())
  }, [dispatch, location?.pathname])

  useEffect(() => {
    if (!resultsArray?.length) return

    const formattedResults = isSessionResultsPage
      ? serializeSessionsArray(resultsArray)
      : mapCertificationData(resultsArray)

    setUserResults(formattedResults)
  }, [resultsArray, rowsPerPage, page])

  return (
    <Card {...props}>
      <Box
        sx={{
          minHeight: "4px"
        }}
      >
        {resultsLoading && <LinearProgress color="primary" />}
      </Box>
      <CardHeader
        action={<MoreMenu />}
        title={isSessionResultsPage ? "All Practice Test Results" : "All Exams"}
      />
      <Scrollbar>
        <Box>
          <Table>
            <TableBody>
              {displayResults.map((exam) => (
                <TableRow hover key={exam?.id}>
                  {isMobileOrSmallTablet ? (
                    <TableRowMobile
                      onDetailsClick={onDetailsClick}
                      exam={exam}
                    />
                  ) : (
                    <TableRowDesktop
                      onDetailsClick={onDetailsClick}
                      exam={exam}
                    />
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
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
                  count={userResults?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {"aria-label": "rows per page"},
                    native: true
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  )
}
