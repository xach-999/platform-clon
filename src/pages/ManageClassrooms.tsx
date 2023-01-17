import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CustomModal from "components/CustomModal"
import React, {useEffect, useMemo, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Box, Button, useTheme, Typography, Switch, FormControlLabel, Chip} from "@mui/material"
import Plus from "assets/icons/Plus"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import useSearchInput from "hooks/useSearchInput"
import {fetchAvailableClassroomsThunk} from "store/slices/schoolSlice/schoolSlice"
import useMainPageLink from "hooks/useMainPageLink"
import {useDispatch, useSelector} from "store"
import {IClassroomItem} from "types/common"
import {LINKS} from "consts/links"

export default function ManageClassrooms() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const pageTitle = useMemo(() => "Classrooms", [])
  const {mainPageLink} = useMainPageLink()

  const classrooms = useSelector((store) => store.schoolSlice.availableClassrooms)
  const schoolLoading = useSelector((store) => store.schoolSlice.loading)
  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)

  const {SearchInputJSX, searchInput} = useSearchInput("Search Classrooms")
  const [loaded, setLoaded] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [joinCodeToDisplay, setJoinCodeToDisplay] = useState<string | null>(null)

  const loading = !loaded || schoolLoading

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter(i => i.isArchived === showArchived)
  }, [classrooms, showArchived])

  useEffect(() => {
    if (!!schoolId) {
      dispatch(fetchAvailableClassroomsThunk({schoolId})).finally(() => {
        setLoaded(true)
      })
    } else {
      setLoaded(true)
    }
  }, [schoolId])

  const tableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "text",
      headerText: "Classroom Name",
      fieldName: "name"
    }, {
      type: "custom",
      headerText: "Join Code",
      content: (i: IClassroomItem) => {
        return (
          <Box display="flex" alignItems="center">
            {i.joinCode}
            <Box ml={0.5}>
              <Button
                size="small"
                sx={{minWidth: 0}}
                onClick={() => setJoinCodeToDisplay(i.joinCode)}>
                <ContentCopyIcon fontSize="small"/>
              </Button>
            </Box>
          </Box>
        )
      }
    }, {
      type: "custom",
      headerText: "Enrolled Students",
      content: (i: IClassroomItem) => {
        return String(i.students.total || 0)
      }
    }, {
      type: "custom",
      headerText: "Teachers",
      content: (i: IClassroomItem) => {
        return String(i.assignedTeachers.length)
      }
    }, {
      type: "custom",
      headerText: "Status",
      content: (i: IClassroomItem) => {
        const statusData: [string, "error" | "warning" | "success"] = i.status === "closed" ? (
          ["Closed", "error"]
        ) : i.isArchived ? ["Archived", "warning"] : ["Open", "success"]

        return (
          <Chip label={statusData[0]} variant="outlined" size="small" color={statusData[1]}/>
        )
      }
    }, {
      type: "custom",
      headerText: "",
      content: (i: IClassroomItem) => (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => navigate(`${LINKS.classrooms}/${i._id}`)}>
          View More Details
        </Button>
      )
    }]
  }, [classrooms])

  const handleAddClass = () => {
    navigate(LINKS.createClassroom)
  }

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={pageTitle}
      pageTitle={pageTitle}
      breadcrumbs={[{
        path: mainPageLink,
        text: "Dashboard"
      }, {
        path: null,
        text: "Classrooms"
      }]}>
      <Box
        minHeight={theme.spacing(32)}
        pt={!loading && !classrooms?.length ? 8 : 0}>
        {!loading && (
          <Box
            display="flex"
            flexDirection={!!classrooms?.length ? "row" : "column"}
            alignItems="center"
            justifyContent={!!classrooms?.length ? "space-between" : "center"}>
            <Box mb={!classrooms?.length ? 2 : 0}>
              {!!classrooms?.length ? (
                SearchInputJSX
              ) : (
                <Typography color="textPrimary" variant="h5">
                  No classrooms found
                </Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
              {!!classrooms?.length && (
                <FormControlLabel
                  label="Archived Classrooms"
                  control={
                    <Switch
                      edge="start"
                      checked={showArchived}
                      onChange={e => setShowArchived(e.target.checked)}
                      inputProps={{"aria-label": "controlled"}}
                    />
                  }
                />
              )}
              <Button
                variant="outlined"
                color="success"
                size="large"
                startIcon={<Plus/>}
                onClick={handleAddClass}>
                Create New Classroom
              </Button>
            </Box>
          </Box>
        )}
        {!loading && classrooms.length > 0 && filteredClassrooms.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" mt={10}>
            <Typography color="textPrimary" variant="h5">
              No classrooms
            </Typography>
          </Box>
        ) : (
          <CustomSearchTable
            rows={filteredClassrooms}
            rowsPerPageOption={50}
            tableSchema={tableSchema}
            loading={loading}
            searchFields={["name", "school.name"]}
            searchInput={searchInput}
          />
        )}
        <CustomModal
          open={!!joinCodeToDisplay}
          onClose={() => setJoinCodeToDisplay(null)}>
          <Box display="flex" justifyItems="center" alignItems="center" py={8} mx={20}>
            <Typography variant="h1" color="textPrimary">
              {joinCodeToDisplay || " "}
            </Typography>
          </Box>
        </CustomModal>
      </Box>
    </CardWithBreadcrumbs>
  )
}
