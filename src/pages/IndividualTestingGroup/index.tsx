import React, {useEffect, useMemo, useState} from "react"
import copyToClipboard from "copy-to-clipboard"
import {notifyUser} from "store/slices/notifier/notifier"
import {useParams} from "react-router-dom"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Menu,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  Typography
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import useMainPageLink from "hooks/useMainPageLink"
import {useDispatch, useSelector} from "store"
import {LINKS} from "consts/links"
import {fetchTestingGroupsThunk, updateTestingGroupStatusThunk} from "store/slices/schoolSlice/schoolSlice"
import ExamSessions from "./components/ExamSessions"
import GeneralContent from "./components/GeneralContent"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"

const tabs = [
  {label: "General", value: "general"},
  {label: "Exam sessions", value: "examSessions"}
]

export default function IndividualTestingGroup() {
  const dispatch = useDispatch()
  const params = useParams()
  const {mainPageLink} = useMainPageLink()

  const [showDisplayJoinCodePopup, setShowDisplayJoinCodePopup] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>("general")
  const [joinCodePopupAnchor, setJoinCodePopupAnchor] = useState<null | HTMLElement>(null)

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const testingGroups = useSelector((store) => store.schoolSlice.testingGroups)

  const joinCodePopupOpened = !!joinCodePopupAnchor

  const testingGroup = useMemo(() => {
    let id = params?.testingGroupId
    if (!testingGroups?.length) return
    return testingGroups.find((gr) => gr.id === id)
  }, [testingGroups, params?.testingGroupId])

  const active = useMemo(() => {
    return testingGroup?.status === "inprogress"
  }, [testingGroup])

  const pageTitle = useMemo(
    () => `Testing Group - ${testingGroup?.name}`,
    [testingGroup]
  )

  useEffect(() => {
    updateDate()
  }, [schoolId])

  const updateDate = () => {
    if (!schoolId) return
    dispatch(fetchTestingGroupsThunk({schoolId, archived: true}))
  }

  const handleOpenJoinCodePopup = (event: React.MouseEvent<HTMLElement>) => {
    setJoinCodePopupAnchor(event.currentTarget)
  }

  const handleJoinCodePopupSelect = (action?: "display" | "copy") => {
    setJoinCodePopupAnchor(null)

    if (action === "display") {
      setShowDisplayJoinCodePopup(true)
    } else if (action === "copy") {
      copyToClipboard(testingGroup?.code)
      dispatch(notifyUser({message: "Copied", variant: "success"}))
    }
  }

  const handleTestingGroupStatusFunc = async () => {
    await dispatch(
      updateTestingGroupStatusThunk({
        id: testingGroup.id,
        status: active ? "done" : "inprogress"
      })
    )
    await updateDate()
    dispatch(
      notifyUser({message: "GROUP_UPDATE_SUCCESS", variant: "success"})
    )
  }

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={pageTitle}
      pageTitle={pageTitle}
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: LINKS.testingGroup,
        text: "Testing Groups"
      }, {
        path: null,
        text: pageTitle
      }]}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        gap="4rem">
        <Tabs
          indicatorColor="primary"
          onChange={(_e, value) => setCurrentTab(value)}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable">
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value}/>
          ))}
        </Tabs>
        <Box display="flex" justifyContent="flex-end">
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            gap="1rem"
            mb={1}>
            <Typography variant="body2" fontWeight="600">
              Testing group entry code
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
                {testingGroup?.code}
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
                    onClick={() =>
                      handleJoinCodePopupSelect(
                        i.toLowerCase() as Parameters<typeof handleJoinCodePopupSelect>[0]
                      )}
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
                  <Box
                    display="flex"
                    justifyItems="center"
                    alignItems="center"
                    py={8}
                    mx={10}>
                    <Typography
                      variant="h1"
                      color="textPrimary"
                      whiteSpace="pre">
                      {testingGroup?.code}
                    </Typography>
                  </Box>
                </DialogContent>
              </Dialog>
            </Box>
          </Box>
          <Box
            position="relative"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap="0.5rem"
            mb={1}
            width={120}>
            <Typography variant="body1" fontWeight="600">
              {active ? "Active" : "Closed"}
            </Typography>
            <Switch
              checked={active}
              color="success"
              edge="start"
              name="direction"
              onChange={handleTestingGroupStatusFunc}
            />
          </Box>
        </Box>
      </Box>
      <Divider/>
      <Box mt={2}>
        {testingGroup && (
          (currentTab === "general" ? (
            <GeneralContent testingGroup={testingGroup} updateDate={updateDate}/>
          ) : (
            <ExamSessions testingGroup={testingGroup}/>
          ))
        )}
      </Box>
    </CardWithBreadcrumbs>
  )
}
