import {useMutation, useQuery} from "@apollo/client"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  LinearProgress,
  Menu,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  Typography
} from "@mui/material"
import {SET_CLASSROOM_STATUS} from "api/apollo/mutations"
import {GET_CLASSROOM} from "api/apollo/queries"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import TestResults from "components/TestResults"
import {LINKS} from "consts/links"
import copyToClipboard from "copy-to-clipboard"
import {
  Classroom,
  ClassroomStatus,
  Mutation,
  MutationSetClassroomStatusArgs,
  Query,
  QueryGetClassroomArgs
} from "generated/graphql"
import useMainPageLink from "hooks/useMainPageLink"
import NotFound from "pages/NotFound"
import React, {useEffect, useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import {handleError} from "store/slices/notifier/notifier"
import {fetchAvailableClassroomsThunk} from "store/slices/schoolSlice/schoolSlice"
import GeneralContent from "./components/GeneralContent"
import RosterContent from "./components/Roster"

export default function ManageClassroom() {
  const {mainPageLink} = useMainPageLink()
  const {classroomId} = useParams()

  const tabs = [
    {label: "General", value: "general"},
    {label: "Roster", value: "roster"},
    {label: "Practice Results", value: "practice-results"},
    {label: "Exam Results", value: "exam-results"}
  ]

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const classroomQuery = useQuery<Query, QueryGetClassroomArgs>(GET_CLASSROOM, {
    fetchPolicy: "network-only",
    variables: {
      classroomId
    }
  })

  const currentClassroom = useMemo<Classroom | null>(() => {
    return classroomQuery.data?.getClassroom || null
  }, [classroomId, classroomQuery.data])

  const [initLoading, setInitLoading] = useState(!currentClassroom)
  const [currentTab, setCurrentTab] = useState<string>("general")
  const [joinCodePopupAnchor, setJoinCodePopupAnchor] = useState<null | HTMLElement>(null)
  const joinCodePopupOpened = !!joinCodePopupAnchor
  const [showDisplayJoinCodePopup, setShowDisplayJoinCodePopup] = useState(false)

  const dispatch = useDispatch()

  const [changeStatus] = useMutation<
    Mutation["setClassroomStatus"],
    MutationSetClassroomStatusArgs
  >(SET_CLASSROOM_STATUS)

  useEffect(() => {
    if (!schoolId) return

    dispatch(fetchAvailableClassroomsThunk({schoolId})).finally(() => {
      setInitLoading(false)
    })
  }, [schoolId])

  const handleOpenJoinCodePopup = (event: React.MouseEvent<HTMLElement>) => {
    setJoinCodePopupAnchor(event.currentTarget)
  }

  const handleJoinCodePopupSelect = (action?: "display" | "copy" | "reset" | "disable") => {
    setJoinCodePopupAnchor(null)

    if (action === "display") {
      setShowDisplayJoinCodePopup(true)
    } else if (action === "copy") {
      copyToClipboard(currentClassroom.joinCode)
    } else if (action === "reset") {
      // TODO: add reset join code action
    } else if (action === "disable") {
      // TODO: add disable join code action
    }
  }

  const handleChangeStatus = (value: boolean) => {
    changeStatus({
      variables: {
        classroomId: currentClassroom._id,
        classroomStatus: value ? ClassroomStatus.Opened : ClassroomStatus.Closed
      }
    }).then(() => {
      dispatch(fetchAvailableClassroomsThunk({schoolId}))
    }).catch(err => {
      dispatch(handleError(err))
    })
  }

  const pageTitle = useMemo(() => `Classroom - ${currentClassroom?.name}`, [currentClassroom])

  return initLoading ? (
    <Box>
      <LinearProgress/>
    </Box>
  ) : currentClassroom ? (
    <CardWithBreadcrumbs
      helmetTabTitle={pageTitle}
      pageTitle={pageTitle}
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: LINKS.classrooms,
        text: "Classrooms"
      }, {
        path: null,
        text: `Classroom - ${currentClassroom.name}`
      }]}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" gap="4rem">
        <Tabs
          indicatorColor="primary"
          onChange={(_e, value) => setCurrentTab(value)}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable">
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        <Box position="relative" display="flex" alignItems="center" gap="2rem" mb={1}>
          {!currentClassroom.isArchived ? (
            <Box position="relative" display="flex" alignItems="center" gap="1rem">
              <Typography variant="body2" fontWeight="600">
                Classroom code
              </Typography>
              <Box position="relative">
                <Button
                  id="join-code-popup-button"
                  aria-controls={joinCodePopupOpened ? "join-code-popup-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={joinCodePopupOpened ? "true" : undefined}
                  variant="outlined"
                  size="large"
                  endIcon={<KeyboardArrowDownIcon/>}
                  onClick={handleOpenJoinCodePopup}>
                  {currentClassroom.joinCode}
                </Button>
                <Menu
                  id="join-code-popup-menu"
                  anchorEl={joinCodePopupAnchor}
                  MenuListProps={{
                    "aria-labelledby": "join-code-popup-button"
                  }}
                  open={joinCodePopupOpened}
                  onClose={() => handleJoinCodePopupSelect()}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}>
                  {["Display", "Copy"].map((i) => (
                    <MenuItem
                      key={i}
                      onClick={() => handleJoinCodePopupSelect(i.toLowerCase() as Parameters<typeof handleJoinCodePopupSelect>[0])}
                      sx={{pr: 11}}>
                      {i}
                    </MenuItem>
                  ))}
                </Menu>
                <Dialog
                  open={showDisplayJoinCodePopup}
                  maxWidth="md"
                  onClose={() => setShowDisplayJoinCodePopup(false)}>
                  <DialogContent>
                    <Box display="flex" justifyItems="center" alignItems="center" py={8} mx={20}>
                      <Typography variant="h1" color="textPrimary">
                        {currentClassroom.joinCode}
                      </Typography>
                    </Box>
                  </DialogContent>
                </Dialog>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" fontWeight="600" color="warningText.main">
              Archived
            </Typography>
          )}
          <Box position="relative" display="flex" justifyContent="flex-end" alignItems="center" gap="0.5rem">
            <Typography variant="body1" fontWeight="600">
              {currentClassroom.status === "opened" ? "Open" : "Closed"}
            </Typography>
            <Switch
              checked={currentClassroom.status === "opened"}
              color="success"
              edge="start"
              name="direction"
              onChange={e => handleChangeStatus(e.target.checked)}
            />
          </Box>
        </Box>
      </Box>
      <Divider/>
      <Box mt={2}>
        {currentTab === "exam-results" ? (
          <TestResults classroomId={currentClassroom._id}/>
        ) : currentTab === "practice-results" ?  (
          <TestResults practice classroomId={currentClassroom._id}/>
        ) : currentTab === "roster" ?  (
          <RosterContent classroom={currentClassroom}/>
        ) : (
          <GeneralContent classroom={currentClassroom}/>
        )}
      </Box>
    </CardWithBreadcrumbs>
  ) : (
    <NotFound/>
  )
}
