import React from "react"
import {Box, Typography} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {useSelector} from "store"

const useStyles = makeStyles((theme) => ({
  content: {
    overflowY: "auto",
    height: "65px",
    padding: theme.spacing(2, 10)
  }
}))

export default function Description() {
  const styles = useStyles()

  const currentTask = useSelector(
    (store) => store.practiceSession.currentTask?.task
  )

  if (currentTask?.type === "multiple") return null

  return (
    <Box className={styles.content}>
      <Typography align="center" variant="subtitle1">
        {currentTask?.description}
      </Typography>
    </Box>
  )
}
