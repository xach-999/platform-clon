import React, {useState} from "react"
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  Typography
} from "@mui/material"
import ExamsList from "./components/ExamsList"
import {useSelector} from "store"
import {ExamsListSectionProps} from "./types.t"
import {sortedExamsListSelector} from "store/selectors"

export default function ExamsListSection({
  onActivateExam,
  onStartExam
}: ExamsListSectionProps) {
  const [isSwitch, setIsSwitch] = useState(false)

  const sortedExamsList = useSelector((state) => sortedExamsListSelector(state, isSwitch))

  return (
    <Grid item xs={12} mt={3}>
      <Card>
        <CardContent>
          <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
            item
            xs={12}>
            <Grid item md={6} xs={12}>
              <Typography color="textPrimary" variant="h5">
                Practice Tests
              </Typography>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={isSwitch}
                    edge="start"
                    name="direction"
                    onChange={() => setIsSwitch((prev) => !prev)}
                  />
                }
                label={
                  <Box>
                    Expired Switch
                    <Typography
                      color="textSecondary"
                      component="p"
                      variant="caption">
                      Display expired practice tests
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
          <ExamsList
            onStartExam={onStartExam}
            onActivateExam={onActivateExam}
            examsList={sortedExamsList}
          />
        </CardContent>
      </Card>
    </Grid>
  )
}
