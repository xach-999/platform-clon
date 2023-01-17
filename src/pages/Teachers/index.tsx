import React, {useEffect, useMemo, useState} from "react"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import Scrollbar from "components/Scrollbar"
import {Box, Button, Grid, Typography} from "@mui/material"
import CustomModal from "components/CustomModal"
import {useDispatch, useSelector} from "store"
import AddTeacherForm from "./components/AddTeacherForm"
import CustomSearchTable from "components/CustomSearchTable"
import useSearchInput from "hooks/useSearchInput"
import {
  createNewTeacherThunk,
  deleteSchoolTeacherThunk,
  fetchAvailableClassroomsThunk,
  fetchSchoolTeachersThunk
} from "store/slices/schoolSlice/schoolSlice"
import {unwrapResult} from "@reduxjs/toolkit"
import {selectTeachers} from "store/slices/schoolSlice/selectors"
import {ISerializedTeacherItem, ITeacherItem} from "types/common"
import useMainPageLink from "hooks/useMainPageLink"
import {ITableSchema} from "components/CustomSearchTable/types.t"

export default function Teachers() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [removeUserModal, setRemoveUserModal] = useState(false)
  const [removeUserData, setRemoveUserData] = useState(null)
  const [teacherToEdit, setTeacherToEdit] = useState<ISerializedTeacherItem | null>(null)
  const [modalType, setModalType] = useState("")
  const dispatch = useDispatch()

  const schoolId = useSelector((store) => store.schoolSlice.currentSchool)
  const teachers = useSelector(selectTeachers)
  const loading = useSelector((store) => store.schoolSlice.loading)

  const {SearchInputJSX, searchInput} = useSearchInput("Search Teachers")
  const {mainPageLink} = useMainPageLink()

  useEffect(() => {
    if (!schoolId) return
    dispatch(fetchSchoolTeachersThunk(schoolId))
  }, [dispatch, schoolId])

  useEffect(() => {
    if (!schoolId) return
    dispatch(fetchAvailableClassroomsThunk({schoolId}))
  }, [schoolId])

  const onAddNewTeacher = async (props) => {
    setTeacherToEdit(null)
    setModalType(null)
    setIsModalOpen(false)

    try {
      const res = await dispatch(
        createNewTeacherThunk({...props, schoolId: schoolId})
      )
      unwrapResult(res)
      await dispatch(fetchSchoolTeachersThunk(schoolId))
    } catch (e) {}
  }
  const handleAddTeacherButtonClick = () => {
    setTeacherToEdit(null)
    setModalType("add")
    setIsModalOpen(true)
  }

  const handleDeleteTeacher = async (teacherId) => {
    closeRemoveUserModal()
    await dispatch(deleteSchoolTeacherThunk({schoolId, teacherId}))
    await dispatch(fetchSchoolTeachersThunk(schoolId))
  }

  const closeRemoveUserModal = () => {
    setRemoveUserModal(false)
    setRemoveUserData(null)
  }

  const tableSchema: ITableSchema = useMemo(() => {
    return [{
      type: "text",
      headerText: "First Name",
      fieldName: "firstName"
    }, {
      type: "text",
      headerText: "Last Name",
      fieldName: "lastName"
    }, {
      type: "text",
      headerText: "Email",
      fieldName: "email"
    }, {
      type: "text",
      headerText: "Admin",
      fieldName: "isAdmin"
    }, {
      type: "text",
      headerText: "Proctor",
      fieldName: "isProctor"
    }, {
      type: "custom",
      headerText: "",
      content: (i: ITeacherItem) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            setRemoveUserData(i)
            setRemoveUserModal(true)
          }}>
          Remove teacher
        </Button>
      )
    }]
  }, [])

  return (
    <>
      <CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTeacherForm
          onAddNewTeacher={onAddNewTeacher}
          teacher={teacherToEdit}
          type={modalType}
          onEditTeacher={onAddNewTeacher}
        />
      </CustomModal>
      <CustomModal open={removeUserModal} onClose={() => setRemoveUserModal(false)}>
        <Box p={4}>
          <Box textAlign="center" marginBottom="5px">
            <Typography variant="h6">
              Remove user from school account
            </Typography>
          </Box>
          <Typography id="modal-modal-description" sx={{mb: 3}}>
            Are you sure you want to remove{" "}
            <Box sx={{fontWeight: "medium", display: "inline"}}>
              {removeUserData?.firstName}
            </Box>{" "}
            from your school account?
          </Typography>
          <Box display="flex" justifyContent="center" columnGap="20px">
            <Button
              variant="contained"
              color="success"
              onClick={closeRemoveUserModal}>
              No
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteTeacher(removeUserData?._id)}>
              Yes
            </Button>
          </Box>
        </Box>
      </CustomModal>
      <CardWithBreadcrumbs
        helmetTabTitle="Admin, Teachers and Proctors"
        pageTitle="Admin, Teachers and Proctors"
        breadcrumbs={[{
          path: mainPageLink,
          text: "Dashboard"
        }, {
          path: null,
          text: "Admin, Teachers and Proctors"
        }]}>
        <Scrollbar>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Grid container spacing={1} width="auto">
              <Grid item>{SearchInputJSX}</Grid>
            </Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddTeacherButtonClick}
              sx={{
                width: "max-content"
              }}>
              Add New Teacher
            </Button>
          </Box>
          <CustomSearchTable
            loading={loading}
            tableSchema={tableSchema}
            rows={teachers}
            searchFields={["firstName", "email", "lastName"]}
            searchInput={searchInput}
          />
        </Scrollbar>
      </CardWithBreadcrumbs>
    </>
  )
}
