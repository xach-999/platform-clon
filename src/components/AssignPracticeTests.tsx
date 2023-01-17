import {useLazyQuery} from "@apollo/client"
import {GET_CLASSROOM} from "api/apollo/queries"
import ManageStudentsWithAssignPT from "components/ManageStudentsWithAssignPT"
import {GetClassroomQuery, QueryGetClassroomArgs} from "generated/graphql"
import React, {useEffect, useMemo, useState} from "react"
import {
  Box,
  Paper,
  Typography
} from "@mui/material"

export default function AssignPracticeTests() {
  const [currentClassroomId, setCurrentClassroomId] = useState("")

  const [classroomQuery, classroom] = useLazyQuery<GetClassroomQuery, QueryGetClassroomArgs>(GET_CLASSROOM, {
    fetchPolicy: "network-only"
  })

  const currentClassroom = useMemo(() => {
    return classroom.data?.getClassroom || undefined
  }, [classroom.data])

  useEffect(() => {
    if (currentClassroomId) {
      classroomQuery({
        variables: {
          classroomId: currentClassroomId
        }
      })
    }
  }, [currentClassroomId])

  return (
    <Box>
      <Box mb={4}>
        <Paper variant="outlined" sx={{p: 2}}>
          <Typography color="textPrimary" variant="h6" mb={2}>
            Students
          </Typography>
          <ManageStudentsWithAssignPT
            noManageAccounts
            classroom={currentClassroom}
            onClassroomChange={id => setCurrentClassroomId(id)}
          />
        </Paper>
      </Box>
    </Box>
  )
}
