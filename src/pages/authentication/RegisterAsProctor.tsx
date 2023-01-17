import React from "react"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import Scrollbar from "components/Scrollbar"
import {List, ListItem, ListItemText, Typography} from "@mui/material"
import PrevNextSection from "components/PrevNextSection"
import {useDispatch, useSelector} from "store"
import {
  fetchUserDetailsThunk,
  registerAsProctorThunk
} from "store/slices/userSlice/userSlice"
import {useNavigate} from "react-router-dom"
import {format} from "date-fns"
import useMainPageLink from "hooks/useMainPageLink"

export default function RegisterAsProctor() {
  const dispatch = useDispatch()

  const navi = useNavigate()

  const {isProctor, proctorSignedAt} = useSelector((state) => ({
    isProctor: state.userSlice.isProctor,
    proctorSignedAt: state.userSlice.proctorSignedAt
  }))

  const {mainPageLink} = useMainPageLink()

  const handleCancelTerms = () => {
    navi(mainPageLink, {replace: true})
  }

  const handleAcceptTerms = async () => {
    await dispatch(registerAsProctorThunk())
    dispatch(fetchUserDetailsThunk())
    // navi(mainPageLink, { replace: true })
  }

  return (
    <CardWithBreadcrumbs
      helmetTabTitle={"Register as Proctor"}
      pageTitle={"Register as Proctor"}
      breadcrumbs={[
        {
          path: mainPageLink,
          text: "Dashboard"
        },
        {
          path: null,
          text: "Register as Proctor"
        }
      ]}
    >
      <Scrollbar>
        {isProctor && (
          <Typography variant={"h6"} textAlign={"center"} mb={4}>
            You are now registered as a Proctor. Terms agreed on{" "}
            {format(new Date(proctorSignedAt), "dd MMM yyyy")}
          </Typography>
        )}
        <Typography variant={"h6"} textAlign={"center"}>
          The Proctor agrees:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText>
              1) To ensure the security of the examination environment during a
              candidate exam session
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              2) To the provision of a quiet and well-lighted area, free from
              noise and distraction and within supervisory distance of the
              proctor
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              3) To verification of time limits and use of only approved
              materials permitted during the examination process
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              4) To the termination of the examination, confiscation of
              materials and immediate notification to KP, if there is an
              improper conduct on the part of the candidate or any evidence that
              the examination process has been violated
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              5) To the supervision of the student during examination sessions,
              including overseeing that no copy of the test or notes containing
              content of the test questions or answers are used by students
              during examination
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              6) To treat examination material as confidential and keep them
              secure
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              7) To remain within a reasonable distance from the candidate in
              order to supervise him during the exam session
            </ListItemText>
          </ListItem>
        </List>
        {!isProctor && (
          <PrevNextSection
            handlePrev={handleCancelTerms}
            handleNext={handleAcceptTerms}
            disabledNext={false}
            PrevText={"Cancel"}
            NextText={"Agree"}
          />
        )}
      </Scrollbar>
    </CardWithBreadcrumbs>
  )
}
