import React from "react"
import {Grid} from "@mui/material"
import ExamItem from "./components/ExamItem"
import AddExamItem from "./components/AddExamItem"
import {ExamsListProps} from "../../types.t"
import BackdropLoad from "components/BackdropLoad"
import {useSelector} from "store"

export default function ExamsList({
  examsList,
  onActivateExam,
  onStartExam
}: ExamsListProps) {
  const loading = useSelector((state) => state.practiceVouchers.loading)

  return (
    <Grid container item spacing={3} xs={12} mt={0}>
      <BackdropLoad open={loading} />
      {!examsList?.length ? (
        <AddExamItem />
      ) : (
        examsList.map((exam) => (
          <ExamItem
            onActivateExam={onActivateExam}
            onStartExam={onStartExam}
            examItem={exam}
            key={exam.id}
          />
        ))
      )}
    </Grid>
  )
}
