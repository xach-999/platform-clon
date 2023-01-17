import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import React, {ChangeEvent, useEffect, useMemo, useState} from "react"
import Scrollbar from "components/Scrollbar"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material"
import {useNavigate} from "react-router-dom"
import {LINKS} from "consts/links"
import {useDispatch, useSelector} from "store"
import {fetchTestingGroupsThunk} from "store/slices/schoolSlice/schoolSlice"
import useSearchInput from "hooks/useSearchInput"
import {ISerializedTestingGroupItem} from "types/common"
import useMainPageLink from "hooks/useMainPageLink"
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions"
import {makeStyles} from "@mui/styles"
import {selectExamCodesForSelect} from "store/slices/schoolSlice/selectors"
import {getExamCodesHaveSessionsThunk} from "store/slices/exams"
import fromAbbrToWords from "consts/fromAbbrToWords"

const useStyles = makeStyles({
  paginationRow: {
    "& .MuiTablePagination-spacer": {
      display: "none"
    }
  },
  formControl: {
    flexBasis: "200px",
    marginRight: "auto",
    margin: "0 2rem",
    boxSizing: "content-box",
    "& *": {
      boxSizing: "content-box !important"
    }
  }
})

const searchFields = ["examCode", "teacherName", "proctoring", "name"]

export default function TestingGroups() {
  const navi = useNavigate()
  const dispatch = useDispatch()
  const {paginationRow} = useStyles()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedExamCode, setSelectedExamCode] = useState("")
  const [showArchives, setShowArchives] = useState(false)

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const availableExamCodesOptions = useSelector(selectExamCodesForSelect)
  const loading = useSelector((store) => store.schoolSlice.loading)
  const testingGroups: Array<ISerializedTestingGroupItem> = useSelector((store) => {
    const groups = store.schoolSlice.testingGroups

    if (!groups?.length) return null

    return groups.map((group) => {
      let examCode = group?.examCode
      const proctoring = group.proctoring
        ? `${group.proctoring[0].toUpperCase()}${group.proctoring.slice(1)}`
        : ""
      const isArchived = group.isArchived ? "done" : "new"
      return {
        ...group,
        examCode,
        proctoring,
        isArchived
      }
    })
  })

  const {SearchInputJSX, searchInput} = useSearchInput("Search Groups")
  const {mainPageLink} = useMainPageLink()

  useEffect(() => {
    if (!schoolId) return
    dispatch(getExamCodesHaveSessionsThunk(schoolId))
  }, [schoolId])

  // const onEditGroup = (id) => {
  //   const group = testingGroups.find((g) => g.id === id);
  //   if (!group) {
  //     dispatch(handleError(new CustomErrorClass("CAN_NOT_EDIT_GROUP")));
  //     return;
  //   }
  //   navi(`${LINKS.addEditTestingGroup}/${id}`);
  // };

  // const onViewGroup = (id) => {
  //   if (!testingGroups?.length) return;
  //   const testGroup = testingGroups.find((gr) => gr.id === id);
  //   if (!testGroup) return;
  //   dispatch(setCurrentTestingGroup(testGroup));
  //   navi(`${LINKS.viewTestingGroup}/${id}`);
  // };

  // const seeResult = (group) => {
  //   navi(LINKS.studentResults, {
  //     state: {
  //       groupId: group._id,
  //       groupName: group.name
  //     }
  //   });
  // };

  // const handleStartButtonClick = (group) => {
  //   if (group.status === "done") {
  //     return seeResult(group)
  //   }

  //   onViewGroup(group.id)
  // }

  const onAddNewTestingGroup = () => {
    navi(LINKS.addTestingGroup)
  }

  // const onDeleteTestingGroup = (id) => {
  //   dispatch(deleteTestingGroupThunk(id))
  // }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event?.target?.value || "5", 10))
    setPage(0)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const viewMoreButton = (groupId) => {
    navi(`${LINKS.testingGroup}/${groupId}`)
  }

  useEffect(() => {
    if (!schoolId) return
    dispatch(fetchTestingGroupsThunk({schoolId, archived: true}))
  }, [schoolId])

  const paginatedRows: Array<ISerializedTestingGroupItem> = useMemo(() => {
    if (!testingGroups?.length) return []

    // get lowerCase input value
    const lowerQuery = searchInput.toLowerCase()

    // filtering by search field
    const queriedTeachers = testingGroups
      .filter((t, index) => {
        if (!searchInput || !searchFields?.length) return true

        let isValid = false
        // look through search fields
        searchFields.forEach((sf) => {
          let valueToCheck = t[sf]

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
        // return result
        return isValid
      })
      .filter((_) =>
        selectedExamCode ? _.examCode === selectedExamCode : true
      )
      .filter((_) => (!showArchives ? _.isArchived !== "done" : true))

    return queriedTeachers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [testingGroups, page, rowsPerPage, searchInput, selectedExamCode])

  return (
    <CardWithBreadcrumbs
      helmetTabTitle="Testing Groups"
      pageTitle="Testing Groups"
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: "Testing Groups"
      }]}>
      <Scrollbar>
        <Box
          display="flex"
          flexDirection={testingGroups ? "row" : "column"}
          justifyContent={testingGroups ? "space-between" : "center"}
          alignItems="center">
          {!testingGroups?.length && !loading && (
            <Typography variant="h6" mb={2}>
              No Testing Groups available. Please create your first testing
              group.
            </Typography>
          )}
          <Box display="flex" alignItems="center">
            {!!testingGroups?.length && SearchInputJSX}
            {!!testingGroups?.length && availableExamCodesOptions && (
              <FormControl
                sx={{minWidth: 130, marginLeft: 1}}
                variant="filled">
                <InputLabel id="select-exam-code">Exam Code</InputLabel>
                <Select
                  variant="outlined"
                  labelId="select-exam-code"
                  name="examCode"
                  value={selectedExamCode || ""}
                  onChange={(e) => {
                    setPage(0)
                    setSelectedExamCode(e.target.value)
                  }}>
                  {[
                    <MenuItem value="">
                      <em>All exams</em>
                    </MenuItem>,
                    ...availableExamCodesOptions?.map(({label, value}) => {
                      return (
                        <MenuItem key={label} value={value}>
                          {`${label} - ${fromAbbrToWords[value]}`}
                        </MenuItem>
                      )
                    })
                  ]}
                </Select>
              </FormControl>
            )}
          </Box>
          {(testingGroups?.length || !loading) && (
            <Box display="flex" gap={1}>
              <Box
                position="relative"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={1}>
                <Typography variant="body1" fontWeight="600" textAlign="right">
                  View Archived Testing Groups
                </Typography>
                <Switch
                  checked={showArchives}
                  color="primary"
                  edge="start"
                  name="direction"
                  onChange={(): void => setShowArchives((prev) => !prev)}
                />
              </Box>
              <Button
                color="primary"
                variant="contained"
                onClick={onAddNewTestingGroup}>
                Add New Testing Group
              </Button>
            </Box>
          )}
        </Box>
        <Box minHeight="4px">
          {loading && <LinearProgress color="primary"/>}
        </Box>
        <Box minWidth={700}>
          {!!testingGroups?.length && (
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Group Name",
                    "Exam Code",
                    "Proctoring",
                    "Teacher",
                    "Status",
                    "Actions"
                  ].map((text) => (
                    <TableCell
                      align={text === "Actions" ? "center" : "left"}
                      key={text}>
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows?.map((group) => {
                  let statusLabel = "New"
                  // let startButtonLabel = "Start Exam";
                  // let startButtonColor: ButtonTypeMap["props"]["color"] =
                  //   "success";
                  if (group?.status === "inprogress") {
                    statusLabel = "In Progress"
                    // startButtonLabel = "View Code/Finish Exam";
                  }
                  if (group?.status === "done") {
                    statusLabel = "Done"
                    // startButtonLabel = "View Results";
                    // startButtonColor = "info";
                  }

                  return (
                    <TableRow key={group?.id}>
                      <TableCell>{group?.name}</TableCell>
                      <TableCell>{group?.examDisplayCode}</TableCell>
                      <TableCell>{group?.proctoring}</TableCell>
                      <TableCell>{group?.teacherName}</TableCell>
                      <TableCell>{statusLabel}</TableCell>
                      <TableCell align="center">
                        {/* <Tooltip
                          title={group?.status !== "new" ? "" : "Edit Group"}
                        >
                          <span>
                            <IconButton
                              size={"small"}
                              disabled={group?.status !== "new"}
                              sx={{ marginRight: "1rem" }}
                              onClick={() => onEditGroup(group?.id)}
                            >
                              <PencilAlt fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip> */}
                        {/* <Tooltip title="Delete Group">
                          <span>
                            <IconButton
                              size={"small"}
                              sx={{ marginRight: "1rem" }}
                              onClick={() => onDeleteTestingGroup(group?.id)}
                            >
                              <Trash fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip> */}
                        {/* <Tooltip title={startButtonLabel}>
                          <span>
                            <Button
                              color={startButtonColor}
                              name={"button"}
                              variant="contained"
                              sx={{ marginRight: "1rem", minWidth: "11rem" }}
                              size={"small"}
                              onClick={() => handleStartButtonClick(group)}
                            >
                              {startButtonLabel}
                            </Button>
                          </span>
                        </Tooltip> */}
                        <Button onClick={() => viewMoreButton(group?.id)}>
                          View more
                        </Button>
                      </TableCell>
                    </TableRow>
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
                    count={Object.keys(testingGroups || [])?.length}
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
          )}
        </Box>
      </Scrollbar>
    </CardWithBreadcrumbs>
  )
}
