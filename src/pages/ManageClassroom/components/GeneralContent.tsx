import {useMutation} from "@apollo/client"
import {ARCHIVE_CLASSROOM} from "api/apollo/mutations"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"
import ConfirmationAlert from "components/ConfirmationAlert"
import CustomModal from "components/CustomModal"
import CustomSearchTable from "components/CustomSearchTable"
import {ITableSchema} from "components/CustomSearchTable/types.t"
import {LINKS} from "consts/links"
import {useFormik} from "formik"
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"
import {ArchiveClassroomMutation, ArchiveClassroomMutationVariables} from "generated/graphql"
import AddItemForm from "pages/ManageClassroom/components/AddItemForm"
import React, {useEffect, useMemo, useState} from "react"
import {Box, Button, Grid, IconButton, Paper, TextField, Tooltip, Typography} from "@mui/material"
import useSearchInput from "hooks/useSearchInput"
import {useNavigate} from "react-router-dom"
import {handleError, notifyUser} from "store/slices/notifier/notifier"
import {
  deleteClassroomThunk,
  fetchAvailableClassroomsThunk,
  fetchSchoolTeachersThunk,
  updateClassroomThunk,
  updateTeacherInClassThunk
} from "store/slices/schoolSlice/schoolSlice"
import {IClassroomItem, ITeacherItem} from "types/common"
import {useDispatch, useSelector} from "store"

interface Props {
  classroom: IClassroomItem
}

export default function GeneralContent({classroom}: Props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    SearchInputJSX: TeachersSearchInputJSX,
    searchInput: teachersSearchInput
  } = useSearchInput("Search Teachers")

  const loading = useSelector((store) => store.schoolSlice.loading)
  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const schoolTeachers = useSelector((store) => store.schoolSlice.teachers)
  const classroomTeachers = schoolTeachers?.filter((i) => classroom.assignedTeachers.includes(i.id)) || []

  const [showArchiveAlert, setShowArchiveAlert] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [teacherToRemove, setTeacherToRemove] = useState<ITeacherItem | null>(null)

  const formik = useFormik({
    initialValues: {
      classroomName: classroom.name
    },
    onSubmit: async (values) => {
      await dispatch(updateClassroomThunk({
        id: classroom._id,
        data: {
          name: values.classroomName
        }
      }))

      await handleGetClassrooms()
    }
  })

  const [archiveClassroom] = useMutation<
    ArchiveClassroomMutation,
    ArchiveClassroomMutationVariables
  >(ARCHIVE_CLASSROOM)

  const teachersTableSchema = useMemo<ITableSchema>(() => {
    return [{
      type: "text",
      headerText: "Name",
      fieldName: "fullName"
    }, {
      type: "text",
      headerText: "Email",
      fieldName: "email"
    }, {
      type: "custom",
      headerText: "Actions",
      content: (data: typeof classroomTeachers[0]) => (
        <Tooltip title="Remove teacher from classroom">
          <span>
            <IconButton size="small" onClick={() => setTeacherToRemove(data)}>
              <PersonRemoveIcon fontSize="small"/>
            </IconButton>
          </span>
        </Tooltip>
      )
    }]
  }, [])

  useEffect(() => {
    if (schoolId) {
      dispatch(fetchSchoolTeachersThunk(schoolId))
    }
  }, [schoolId])

  const handleGetClassrooms = () => {
    return dispatch(fetchAvailableClassroomsThunk({schoolId}))
  }

  const handleArchive = (action: "ARCHIVE" | "UNARCHIVE") => {
    archiveClassroom({
      variables: {
        archived: action === "ARCHIVE",
        classroomId: classroom._id
      }
    }).then(() => {
      handleGetClassrooms()
      dispatch(notifyUser({
        message: action === "ARCHIVE" ? "Classroom archived" : "Classroom unarchived"
      }))
    }).catch((err) => {
      dispatch(handleError(err))
    })
  }

  const handleDelete = () => {
    dispatch(deleteClassroomThunk(classroom._id))
    navigate(LINKS.classrooms)
  }

  const handleManageTeacher = async (action: "ADD" | "REMOVE", id: string) => {
    await dispatch(updateTeacherInClassThunk({
      teacherId: id,
      classroomId: classroom._id,
      action
    }))

    dispatch(fetchSchoolTeachersThunk(schoolId))
    handleGetClassrooms()
  }

  return (
    <Box position="relative">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <form onSubmit={formik.handleSubmit} style={{width: "50%"}}>
          <Grid
            container
            spacing={2}
            width="100%"
            direction="row"
            alignItems="center">
            <Grid item xs={8}>
              <TextField
                size="medium"
                id="classroomName"
                fullWidth
                placeholder="Classroom Name"
                onChange={formik.handleChange}
                value={formik.values.classroomName}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}>
                Change Name
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Box my={2}>
        <Paper variant="outlined" sx={{p: 2}}>
          <Typography color="textPrimary" variant="h6" mb={2}>
            Teachers
          </Typography>
          <Box mt={2}>
            {!loading && (
              <Box
                display="flex"
                flexDirection={!!classroomTeachers.length ? "row" : "column"}
                alignItems="center"
                justifyContent={!!classroomTeachers.length ? "space-between" : "center"}
                mb={!classroomTeachers?.length ? 4 : 0}>
                <Box sx={{mb: !classroomTeachers?.length ? 2 : 0}}>
                  {!!classroomTeachers?.length ? (
                    TeachersSearchInputJSX
                  ) : (
                    <Typography color="textPrimary" variant="h6">
                      No teachers found
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => setShowAddTeacherModal(true)}
                  startIcon={<PersonAddAlt1Icon fontSize="medium"/>}
                  sx={{py: 1.25}}>
                  Add Teacher
                </Button>
              </Box>
            )}
            <CustomModal open={showAddTeacherModal} onClose={() => setShowAddTeacherModal(false)}>
              <AddItemForm
                classroom={classroom}
                data={schoolTeachers}
                checkedIds={classroomTeachers.map((i) => i.id)}
                searchFields={["fullName", "email"]}
                checkboxTitle="Assigned"
                checkActionHandler={(action, id) => handleManageTeacher(action, id)}
                tableSchema={teachersTableSchema.slice(0, 2)}
                searchPlaceholder="Search Teachers"
              />
            </CustomModal>
            <CustomSearchTable
              rows={classroomTeachers}
              rowsPerPageOption={50}
              tableSchema={teachersTableSchema}
              loading={loading}
              searchFields={["email", "fullName"]}
              searchInput={teachersSearchInput}
            />
            <ConfirmationAlert
              isOpen={!!teacherToRemove}
              setOpen={() => setTeacherToRemove(null)}
              handleConfirm={() => handleManageTeacher("REMOVE", teacherToRemove?.id)}
              handleCancel={() => setTeacherToRemove(null)}
              dialogTitle={`Are you sure you want to remove ${teacherToRemove?.firstName} ${teacherToRemove?.lastName} from the classroom ${classroom.name}?`}
              cancelText="No"
              confirmText={{color: "error", text: "Yes, remove"}}
            />
          </Box>
        </Paper>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2} py={2}>
        <Button
          variant="outlined"
          size="large"
          color="warning"
          onClick={() => classroom.isArchived ? handleArchive("UNARCHIVE") : setShowArchiveAlert(true)}>
          {classroom.isArchived ? "Unarchive Classroom" : "Archive Classroom"}
        </Button>
        <ConfirmationAlert
          isOpen={showArchiveAlert}
          setOpen={setShowArchiveAlert}
          handleConfirm={() => handleArchive("ARCHIVE")}
          handleCancel={() => setShowArchiveAlert(false)}
          dialogTitle={`Are you sure you want to archive classroom ${classroom.name}?`}
          cancelText="Cancel"
          confirmText={{color: "warning", text: "Archive"}}
        />
        <Button variant="outlined" size="large" color="error" onClick={() => setShowDeleteAlert(true)}>
          Delete Classroom
        </Button>
        <ConfirmationAlert
          isOpen={showDeleteAlert}
          setOpen={setShowDeleteAlert}
          handleConfirm={handleDelete}
          handleCancel={() => setShowDeleteAlert(false)}
          dialogTitle={`Are you sure you want to delete classroom ${classroom.name}?`}
          dialogContentText="If this classroom has students assigned they will be removed from the classroom."
          cancelText="Cancel"
          confirmText={{color: "error", text: "Delete"}}
        />
      </Box>
    </Box>
  )
}
