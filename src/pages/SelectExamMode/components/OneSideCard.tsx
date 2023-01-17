import React from "react"
import {Box, Grid, Typography} from "@mui/material"
import CertIcon from "assets/icons/CertIcon"
import SportsIcon from "assets/icons/SportsIcon"
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles({
  msContent: {
    display: "flex"
  },
  msContentColumn: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "40px",
    width: "50%",
    "&:hover svg": {
      opacity: "0.7"
    }
  },
  msContentImage: {
    width: "150px",
    height: "150px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > svg": {
      cursor: "pointer",
      color: "#656565",
      transition: ".4s ease"
    }
  }
})

interface Props {
  examType: "real" | "practice"
  onSelectExamMode: (selectedMode: string) => void
}

export default function OneSideCard({examType, onSelectExamMode}: Props) {
  const styles = useStyles()

  return (
    <Grid item className={styles.msContentColumn} xs={12} sm={6}>
      <div
        className={styles.msContentImage}
        onClick={() => onSelectExamMode(examType)}
      >
        {examType === "real" ? CertIcon : SportsIcon}
      </div>
      <Box maxWidth={"300px"}>
        <Typography variant="h6" textAlign={"center"}>
          {examType === "real" ? "Exam simulator" : "Practice mode"}
        </Typography>
        {/*<Typography
          textAlign={"center"}
          lineHeight={"22px"}
          fontSize={"15px"}
          >
          {examType === "real"
            ?
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, porro."
            :
            "Lorem ipsum dolor sit amet, consectetur dipisicing elit. Porro, ratione sit. Porro!"}
        </Typography>*/}
      </Box>
    </Grid>
  )
}
