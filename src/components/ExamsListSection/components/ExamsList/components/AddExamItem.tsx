import React, {useRef} from "react"
import {Card, Grid, ToggleButton} from "@mui/material"
import {useTheme} from "@mui/material"
import Plus from "assets/icons/Plus"
import {useNavigate} from "react-router"
import {LINKS} from "consts/links"

export default function AddExamItem() {
  const plusBtnRef = useRef(null)
  const navigate = useNavigate()
  const theme = useTheme()

  const onAddExam = () => {
    let addr = `${LINKS.addExamByVoucher}`

    if (window.location.href.includes("/practice-tests")) {
      addr = `/practice-tests${addr}`
      navigate(addr)
    }
  }

  return (
    <Grid item xs={3} ref={plusBtnRef}>
      <Card
        onClick={onAddExam}
        sx={{
          backgroundColor: theme.palette.background.paper,
          height: "150px",
          width: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: `2px solid ${theme.palette.primary.main}`
        }}
      >
        <ToggleButton
          value="grid"
          sx={{width: "100%", height: "100%", padding: 0}}
        >
          <Plus
            fontSize={"large"}
            sx={{
              color: theme.palette.primary.main
            }}
          />
        </ToggleButton>
      </Card>
    </Grid>
  )
}
