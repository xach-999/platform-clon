import {useEffect, useMemo, useState} from "react"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@mui/material"
import {LINKS} from "consts/links"
import CardWithBreadcrumbs from "components/CardWithBreadcrumbs"
import {useNavigate, useParams} from "react-router-dom"
import {useDispatch, useSelector} from "store"
import {
  fetchTestingGroupByIdThunk,
  setCurrentTestingGroup,
  updateTestingGroupStatusThunk
} from "store/slices/schoolSlice/schoolSlice"
import useMainPageLink from "hooks/useMainPageLink"
import fromAbbrToWords from "consts/fromAbbrToWords"
import {makeStyles} from "@mui/styles"
import BackdropLoad from "components/BackdropLoad"

const useStyles = makeStyles((theme) => ({
  proctorLoginForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  proctorLoginInput: {
    maxWidth: "60%",
    [theme.breakpoints.down("lg")]: {
      maxWidth: "80%"
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: "95%"
    }
  }
}))

export default function ViewTestingGroup() {
  const [fields, setFields] = useState([])
  const [step, setStep] = useState(null)
  const navi = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const {proctorLoginInput} = useStyles()

  const testingGroup = useSelector(
    (state) => state.schoolSlice.currentTestingGroup
  )
  const loading = useSelector((state) => state.schoolSlice.loading)
  const {mainPageLink} = useMainPageLink()

  const {breadcrumbs, titleText, nextButtonText} = useMemo(() => {
    const startBr = [
      {
        path: mainPageLink,
        text: "Dashboard"
      },
      {
        path: LINKS.testingGroup,
        text: "Testing Groups"
      }
    ]

    let breadcrumbs = startBr
    let titleText = "View Group"
    let nextButtonText = "Start Exam"

    switch (step) {
      case 0:
        titleText = `Start Exam: ${testingGroup?.name || "Unknown"}`
        nextButtonText = "Start Exam"
        breadcrumbs = [
          ...startBr,
          {
            path: null,
            text: "Start Exam"
          }
        ]
        break
      case 1:
        titleText = "Exam Code"
        nextButtonText = "Finish Exam"
        breadcrumbs = [
          ...startBr,
          {
            path: null,
            text: "Exam Code"
          },
          {
            path: null,
            text: "Exam Code"
          }
        ]
        break
    }

    return {
      breadcrumbs,
      titleText,
      nextButtonText
    }
  }, [step, testingGroup])

  const startExamFunc = async (statusToSet) => {
    await dispatch(
      updateTestingGroupStatusThunk({
        id: testingGroup.id,
        status: statusToSet
      })
    )
    if (statusToSet === "done") {
      navi(LINKS.testingGroup, {replace: true})
      return
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    const isNewStatus = testingGroup?.status === "new"

    if (step < 1) return navi(LINKS.testingGroup, {replace: true})
    if (step === 1 && !isNewStatus)
      return navi(LINKS.testingGroup, {replace: true})

    setStep((prev) => prev - 1)
  }

  const handleNext = async () => {
    const isNewStatus = testingGroup?.status === "new"

    if (step === 0 && isNewStatus) return startExamFunc("inprogress")
    if (step === 1 && !isNewStatus) return startExamFunc("done")

    setStep((prev) => prev + 1)
  }

  const renderHelper = () => {
    // ? proctor page uncomment
    /*if (step === 2) {
      return (
        <Box>
          <Typography variant="h5" textAlign="center" mb={2}>Proctor Confirmation</Typography>
          <form className={proctorLoginForm}>
            <TextField
              className={proctorLoginInput}
              fullWidth
              label="Email Or Username"
              margin="normal"
              name="username"
              type="email"
              variant="outlined"
              onChange={(e) => setProctorForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <LockIcon/>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={proctorLoginInput}
              fullWidth
              label="Password"
              margin="normal"
              name="password"
              type="password"
              variant="outlined"
              onChange={(e) => setProctorForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <LockIcon/>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Box>
      )
    }*/

    if (step === 1) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Typography variant="h5" textAlign="center" mb={2}>
            Exam Code
          </Typography>
          <TextField
            className={proctorLoginInput}
            fullWidth
            margin="normal"
            name="examCode"
            type="test"
            variant="outlined"
            value={testingGroup?.code}
            onChange={(e) => e.preventDefault()}
          />
        </Box>
      )
    }

    if (step < 2) {
      return (
        <Table>
          <TableBody>
            {fields.map(({label, value}, index) => {
              return (
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
              )
            })}
          </TableBody>
        </Table>
      )
    }
  }

  useEffect(() => {
    if (step !== null) return
    if (!testingGroup?.status) return
    setStep(testingGroup.status === "new" ? 0 : 1)
  }, [step, testingGroup])

  useEffect(() => {
    if (!testingGroup) {
      if (params?.groupId) {
        dispatch(fetchTestingGroupByIdThunk(params.groupId))
      }
      return
    }

    setFields([
      {
        label: "Group Name",
        value: testingGroup.name
      },
      {
        label: "Exam Name",
        value: `${testingGroup.examCode} - ${
          fromAbbrToWords[testingGroup.examCode]
        }`
      },
      {
        label: "Teacher",
        value: testingGroup.teacherName
      },
      {
        label: "Proctor",
        value: testingGroup.proctorName || "None"
      },
      {
        label: "Proctoring",
        value: testingGroup.proctoring
      },
      {
        label: "Payment Type",
        value: testingGroup.paymentType
      },
      {
        label: "Status",
        value: testingGroup.isArchived ? "Done" : "New"
      },
      {
        label: "License",
        value: testingGroup.licenseName || testingGroup.licenseId
      }
    ])
  }, [testingGroup, params])

  useEffect(() => {
    return () => {
      dispatch(setCurrentTestingGroup(null))
    }
  }, [])

  return (
    <>
      <BackdropLoad open={loading || step === null} />
      <CardWithBreadcrumbs
        helmetTabTitle={titleText}
        pageTitle={titleText}
        breadcrumbs={breadcrumbs}
      >
        {renderHelper()}
        <Box
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
            p: 1
          }}
        >
          <Button
            color="primary"
            sx={{mt: 5, minWidth: "7rem"}}
            variant="outlined"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            color="primary"
            sx={{mt: 5, minWidth: "7rem"}}
            variant="contained"
            onClick={handleNext}
          >
            {nextButtonText}
          </Button>
        </Box>
      </CardWithBreadcrumbs>
    </>
  )
}
