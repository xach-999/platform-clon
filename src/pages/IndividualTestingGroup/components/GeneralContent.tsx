import ConfirmationAlert from "components/ConfirmationAlert"
import React, {useMemo, useState} from "react"
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "store"
import {
  deleteTestingGroupThunk,
  updateTestingGroupArchiveThunk
} from "store/slices/schoolSlice/schoolSlice"
import fromAbbrToWords from "consts/fromAbbrToWords"
import {LINKS} from "consts/links"

export default function GeneralContent({testingGroup, updateDate}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showArchiveAlert, setShowArchiveAlert] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const fields = useMemo(() => {
    if (!testingGroup) return []

    const getDateFormat = (date) => {
      if(!date) return
      let time = new Date(date)
      let t = time.toDateString().split(" ").slice(1)
      let hour = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })
      return `${t[1]} ${t[0]} ${t[2]} ${hour}`
    }

    let details = [
      {
        label: "Testing Group Name",
        value: testingGroup?.name
      },
      {
        label: "Created at:",
        value: getDateFormat(testingGroup.createdAt)
      },
      {
        label: "Exam Code",
        value: `${testingGroup?.examDisplayCode} - ${
          fromAbbrToWords[testingGroup?.examCode]
        }`
      },
      {
        label: "Testing group entry code",
        value: testingGroup?.code
      },
      {
        label: "Proctoring mode",
        value: testingGroup?.proctoring
      },
      {
        label: "Teacher",
        value: testingGroup?.teacherName
      },
      {
        label: "Proctor",
        value: testingGroup?.proctorName
      },
      {
        label: "Payment Type",
        value: testingGroup?.paymentType
      }
    ]

    if(testingGroup?.paymentType === "License inventory"){
      details.push({
        label: "License ID",
        value: testingGroup?.licenseId
      },
      {
        label: "License Name",
        value: testingGroup?.licenseName
      })
    }

    return details
  }, [testingGroup])

  const isArchived = useMemo(() => {
    return !testingGroup.isArchived || testingGroup.isArchived === "new"
  }, [testingGroup])

  const handleArchive = async () => {
    await dispatch(
      updateTestingGroupArchiveThunk({
        groupId: testingGroup?.id,
        archive: isArchived
      })
    )
    updateDate()
  }

  const handleDelete = async () => {
    await dispatch(deleteTestingGroupThunk(testingGroup?.id))
    navigate(LINKS.testingGroup)
  }

  const onEditGroup = (id) => {
    navigate(`${LINKS.addEditTestingGroup}/${id}`)
  }

  return (
    <Box position="relative">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Testing Group Detalis</Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onEditGroup(testingGroup?.id)}
        >
          Edit Testing Group
        </Button>
      </Box>
      <Table component={Paper} sx={{mt: 3}}>
        <TableBody>
          {fields.map(({label, value}, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  {label}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={2}
        mt={3}
      >
        <Button
          variant="outlined"
          size="large"
          color={isArchived ? "warning" : "success"}
          onClick={() => setShowArchiveAlert(true)}
        >
          {isArchived ? "Archive" : "Unarchived"}
        </Button>
        <ConfirmationAlert
          isOpen={showArchiveAlert}
          setOpen={setShowArchiveAlert}
          handleConfirm={handleArchive}
          handleCancel={() => setShowArchiveAlert(false)}
          dialogTitle={`Are you sure you want to ${
            isArchived ? "archive" : "unarchive"
          } testing group ${testingGroup?.name}?`}
          cancelText="Cancel"
          confirmText={{
            color: isArchived ? "warning" : "success",
            text: isArchived ? "Archive" : "Unarchive"
          }}
        />
        <Button
          variant="outlined"
          size="large"
          color="error"
          onClick={() => setShowDeleteAlert(true)}
        >
          Delete
        </Button>
        <ConfirmationAlert
          isOpen={showDeleteAlert}
          setOpen={setShowDeleteAlert}
          handleConfirm={handleDelete}
          handleCancel={() => setShowDeleteAlert(false)}
          dialogTitle={`Are you sure you want to delete testing group ${testingGroup?.name}?`}
          cancelText="Cancel"
          confirmText={{color: "error", text: "Delete"}}
        />
      </Box>
    </Box>
  )
}
