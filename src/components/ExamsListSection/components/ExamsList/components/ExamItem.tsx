import React from "react"
import {ExamItemProps} from "../../../types.t"
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@mui/material"
import {makeStyles} from "@mui/styles"
import {format} from "date-fns"

const useStyles = makeStyles({
  logoImage: {
    maxWidth: "98px",
    maxHeight: "98px",
    boxShadow:
      "0px 1px 2px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
    borderRadius: "50%",
    padding: "5px",
    zIndex: 1,
    backgroundColor: "#ffffff"
  }
})

export default function ExamItem({
  examItem,
  onStartExam,
  onActivateExam
}: ExamItemProps) {
  const styles = useStyles()

  const StartOrActivateExamHandler = () => {
    return examItem?.expired ? onActivateExam(examItem) : onStartExam(examItem)
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Grid container direction={"column"} spacing={4}>
            <Grid
              item
              sx={{
                maxWidth: "100% !important"
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textTransform: "uppercase",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}
              >
                {examItem?.code ? examItem.code.toUpperCase() : "Exam"}
              </Typography>
              <Typography
                variant={"subtitle1"}
                sx={{
                  wordBreak: "break-all"
                }}
              >
                {examItem?.examName}
              </Typography>
            </Grid>
            <Box
              mt={4}
              sx={{
                marginLeft: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                "&:after": {
                  content: "\" \"",
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  height: "1px",
                  width: "100%",
                  backgroundColor: "#ffffff",
                  zIndex: 0,
                  boxShadow:
                    "0px 1px 2px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.05)"
                }
              }}
            >
              <img
                // src={examCodeToImageURL[examItem?.examCode]}
                src={`/practiceDetailsIcons/${examItem?.examCode}.png`}
                alt=""
                className={styles.logoImage}
              />
            </Box>
            {/*BEGIN TEST*/}
            <Grid item sm={2}>
              <Button
                onClick={StartOrActivateExamHandler}
                variant={examItem?.expired ? "outlined" : "contained"}
                color={"primary"}
                fullWidth={true}
                sx={{
                  color: examItem?.expired ? "#2092c0" : "white"
                }}
              >
                {examItem?.expired ? "Activate new key" : "Begin test"}
              </Button>
            </Grid>
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Typography
                variant={"subtitle2"}
                color={"green"}
                fontWeight={"bold"}
                fontSize={"13px"}
              >
                {!examItem?.expired &&
                  `Valid until ${format(
                    Date.parse(
                      examItem?.expirationDate || new Date().toISOString()
                    ),
                    "dd MMM yyyy"
                  )}`}
              </Typography>
              <Typography
                variant="button"
                display="block"
                color={examItem?.expired ? "error" : "green"}
                textAlign={"right"}
              >
                {examItem?.expired ? "Expired" : "Active"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
