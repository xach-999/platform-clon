import React, {ChangeEvent, useEffect, useState} from "react"
import CheckInputOption from "./CheckInputOption"
import {Box, Card, CardContent} from "@mui/material"
import Button from "@mui/material/Button"
import {makeStyles} from "@mui/styles"
import {
  ObjectivesListType,
  ObjectivesModalProps
} from "pages/PracticeModeOptions/types.t"

const useStyles = makeStyles({
  modalWrap: {
    position: "fixed",
    height: "400px",
    width: "auto",
    minWidth: "500px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 16px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    maxHeight: "calc(100vh - 60px - 86px)",
    opacity: 0,
    visibility: "hidden",
    transition: "all 0.4s ease",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -65%)",
    zIndex: 50000,
    padding: "0.2rem",
    "&.opened": {
      opacity: 1,
      visibility: "visible",
      transform: "translate(-50%, -50%)"
    }
  },
  modalTitle: {
    textAlign: "center",
    fontSize: "20px",
    marginBottom: "1rem",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"",
    fontWeight: "bold"
  },
  modalContent: {
    flexGrow: 1,
    maxHeight: "100%",
    overflow: "auto"
  },
  modalControl: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    borderTop: "1px solid #ddd",
    padding: "1rem 0 0 0"
  },
  modalBtn: {
    minWidth: "100px"
  }
})

export default function ObjectivesModal({
  modalName,
  isModal,
  setIsModal,
  onConfirmModal,
  objectivesList
}: ObjectivesModalProps) {
  const [objectives, setObjectives] = useState<ObjectivesListType>(objectivesList)

  const s = useStyles()

  const handleModalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const changedField = objectives[event.target.name]

    if (!changedField) return

    changedField.isChecked = !changedField.isChecked

    setObjectives((prev) => {
      return {
        ...prev,
        [changedField.id]: changedField
      }
    })
  }

  useEffect(() => {
    if (objectivesList) setObjectives(objectivesList)
  }, [objectivesList])

  return (
    <Card className={`${s.modalWrap} ${isModal ? "opened" : ""}`}>
      <CardContent
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}>
        <Box className={s.modalTitle}>
          Choose Objectives
        </Box>
        <Box className={s.modalContent}>
          {objectives &&
            Object.values(objectives).map((field) => {
              return (
                <CheckInputOption
                  key={field.id}
                  handleChange={handleModalChange}
                  isChecked={field.isChecked}
                  fieldName={field.id}
                  preDescription={field.title}
                />
              )
            })}
        </Box>
        <Box className={s.modalControl}>
          <Button
            className={s.modalBtn}
            variant="outlined"
            onClick={() => setIsModal(modalName, false)}>
            Cancel
          </Button>
          <Button
            className={s.modalBtn}
            variant="contained"
            onClick={() => {
              onConfirmModal(objectives)
              setIsModal(modalName, false)
            }}>
            Ok
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
